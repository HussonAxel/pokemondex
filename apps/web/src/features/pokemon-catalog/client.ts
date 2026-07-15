import type { Collection } from "@tanstack/react-db";
import {
  createCollection,
  localOnlyCollectionOptions,
} from "@tanstack/react-db";

import { pokemonCatalogManifest } from "@/generated/pokemon-catalog-manifest";
import {
  pokemonCatalogSchema,
  queryPokemonCatalog,
  type PokemonCatalogInput,
  type PokemonCatalogItem,
} from "@my-better-t-app/catalog";

const DATABASE_NAME = "pokemondex-public-catalog";
const DATABASE_VERSION = 1;
const SNAPSHOT_STORE = "snapshots";

type CatalogSnapshot = {
  hash: string;
  schemaVersion: number;
  storedAt: number;
  items: PokemonCatalogItem[];
};

type CatalogClientState =
  | { status: "idle" | "loading" | "ready"; error?: undefined }
  | { status: "error"; error: Error };

let collection: Collection<PokemonCatalogItem, number> | undefined;
let catalogItems: PokemonCatalogItem[] | undefined;
let initialization: Promise<Collection<PokemonCatalogItem, number>> | undefined;
let state: CatalogClientState = { status: "idle" };
const listeners = new Set<() => void>();

function setState(nextState: CatalogClientState) {
  state = nextState;
  for (const listener of listeners) listener();
}

export function subscribeToPokemonCatalog(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPokemonCatalogClientState() {
  return state;
}

function openCatalogDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(SNAPSHOT_STORE)) {
        request.result.createObjectStore(SNAPSHOT_STORE, { keyPath: "hash" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function readSnapshots(database: IDBDatabase) {
  return new Promise<CatalogSnapshot[]>((resolve, reject) => {
    const request = database
      .transaction(SNAPSHOT_STORE, "readonly")
      .objectStore(SNAPSHOT_STORE)
      .getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as CatalogSnapshot[]);
  });
}

async function writeSnapshot(
  database: IDBDatabase,
  snapshot: CatalogSnapshot,
) {
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(SNAPSHOT_STORE, "readwrite");
    const store = transaction.objectStore(SNAPSHOT_STORE);
    store.put(snapshot);
    const keysRequest = store.getAllKeys();
    keysRequest.onsuccess = () => {
      for (const key of keysRequest.result) {
        if (key !== snapshot.hash) store.delete(key);
      }
    };
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

async function fetchCurrentCatalog() {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(pokemonCatalogManifest.url, {
        cache: "force-cache",
      });
      if (!response.ok) {
        throw new Error(`Catalog request failed with status ${response.status}`);
      }
      return pokemonCatalogSchema.parse(await response.json());
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to load the Pokemon catalog");
}

async function loadCatalogItems() {
  let database: IDBDatabase | undefined;
  let snapshots: CatalogSnapshot[] = [];

  try {
    database = await openCatalogDatabase();
    snapshots = await readSnapshots(database);
  } catch {
    // IndexedDB is an acceleration layer; the CDN remains usable without it.
  }

  const currentSnapshot = snapshots.find(
    (snapshot) =>
      snapshot.hash === pokemonCatalogManifest.hash &&
      snapshot.schemaVersion === pokemonCatalogManifest.schemaVersion &&
      pokemonCatalogSchema.safeParse(snapshot.items).success,
  );

  if (currentSnapshot) {
    return pokemonCatalogSchema.parse(currentSnapshot.items);
  }

  try {
    const items = await fetchCurrentCatalog();
    if (database) {
      await writeSnapshot(database, {
        hash: pokemonCatalogManifest.hash,
        schemaVersion: pokemonCatalogManifest.schemaVersion,
        storedAt: Date.now(),
        items,
      }).catch(() => undefined);
    }
    return items;
  } catch (error) {
    const fallback = snapshots
      .filter(
        (snapshot) =>
          snapshot.schemaVersion === pokemonCatalogManifest.schemaVersion,
      )
      .sort((left, right) => right.storedAt - left.storedAt)
      .find((snapshot) => pokemonCatalogSchema.safeParse(snapshot.items).success);

    if (fallback) return pokemonCatalogSchema.parse(fallback.items);
    throw error;
  }
}

export function startPokemonCatalogClient() {
  if (collection) return Promise.resolve(collection);
  if (initialization) return initialization;

  setState({ status: "loading" });
  initialization = loadCatalogItems()
    .then(async (items) => {
      const nextCollection = createCollection(
        localOnlyCollectionOptions<PokemonCatalogItem, number>({
          id: `pokemon-catalog-${pokemonCatalogManifest.hash}`,
          getKey: (item) => item.id,
          initialData: items,
        }),
      );
      await nextCollection.preload();
      catalogItems = items;
      collection = nextCollection;
      setState({ status: "ready" });
      return nextCollection;
    })
    .catch((error: unknown) => {
      const catalogError =
        error instanceof Error ? error : new Error("Catalog initialization failed");
      initialization = undefined;
      setState({ status: "error", error: catalogError });
      throw catalogError;
    });

  return initialization;
}

export async function queryClientPokemonCatalog(input: PokemonCatalogInput) {
  const catalogCollection = await startPokemonCatalogClient();
  return queryPokemonCatalog(catalogItems ?? catalogCollection.toArray, input);
}

export function retryPokemonCatalogClient() {
  initialization = undefined;
  collection = undefined;
  catalogItems = undefined;
  return startPokemonCatalogClient();
}
