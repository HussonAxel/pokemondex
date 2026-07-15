import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import {
  mkdir,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";

import { pokemonCatalogSchema } from "@my-better-t-app/catalog";

const MAX_GZIP_BYTES = 50 * 1024;
const MIN_EXPECTED_ROWS = 1_000;
const CATALOG_SCHEMA_VERSION = 1;

async function writeAtomic(path: string, contents: string) {
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, contents);
  await rename(temporaryPath, path);
}

export async function generatePokemonCatalog() {
  const [{ db, pokemon }, { asc }] = await Promise.all([
    import("@my-better-t-app/db"),
    import("drizzle-orm"),
  ]);

  const rows = await db
    .select({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types,
      abilities: pokemon.abilities,
      stats: pokemon.stats,
      generation: pokemon.generation,
      species: pokemon.species,
    })
    .from(pokemon)
    .orderBy(asc(pokemon.id));

  const catalog = pokemonCatalogSchema.parse(
    rows.map((row) => {
      const abilities = row.abilities ?? [];
      const stats = row.stats;

      return {
        id: row.id,
        name: row.name,
        types: row.types ?? [],
        visibleAbilityNames: abilities
          .filter((entry) => !entry.is_hidden)
          .map((entry) => entry.ability.name),
        hiddenAbilityNames: abilities
          .filter((entry) => entry.is_hidden)
          .map((entry) => entry.ability.name),
        bst: stats
          ? stats.hp +
            stats.attack +
            stats.defense +
            stats.specialAttack +
            stats.specialDefense +
            stats.speed
          : 0,
        generation: row.generation,
        speciesUrl: row.species?.url ?? null,
      };
    }),
  );

  if (catalog.length < MIN_EXPECTED_ROWS) {
    throw new Error(
      `Catalog generation aborted: expected at least ${MIN_EXPECTED_ROWS} rows, received ${catalog.length}`,
    );
  }

  const json = JSON.stringify(catalog);
  const gzipBytes = gzipSync(json).byteLength;
  if (gzipBytes > MAX_GZIP_BYTES) {
    throw new Error(
      `Catalog generation aborted: gzip size ${gzipBytes} exceeds ${MAX_GZIP_BYTES} bytes`,
    );
  }

  const hash = createHash("sha256").update(json).digest("hex").slice(0, 16);
  const root = resolve(import.meta.dirname, "../../../..");
  const publicDirectory = resolve(root, "apps/web/public/catalog");
  const generatedDirectory = resolve(root, "apps/web/src/generated");
  const publicFileName = `pokemon-catalog.${hash}.json`;

  await Promise.all([
    mkdir(publicDirectory, { recursive: true }),
    mkdir(generatedDirectory, { recursive: true }),
  ]);

  await Promise.all([
    writeAtomic(resolve(publicDirectory, publicFileName), json),
    writeAtomic(resolve(generatedDirectory, "pokemon-catalog.json"), json),
    writeAtomic(
      resolve(generatedDirectory, "pokemon-catalog-manifest.ts"),
      `export const pokemonCatalogManifest = ${JSON.stringify(
        {
          schemaVersion: CATALOG_SCHEMA_VERSION,
          hash,
          count: catalog.length,
          gzipBytes,
          url: `/catalog/${publicFileName}`,
        },
        null,
        2,
      )} as const;\n`,
    ),
  ]);

  const publicFiles = await readdir(publicDirectory);
  await Promise.all(
    publicFiles
      .filter(
        (fileName) =>
          fileName.startsWith("pokemon-catalog.") &&
          fileName.endsWith(".json") &&
          fileName !== publicFileName,
      )
      .map((fileName) => rm(resolve(publicDirectory, fileName))),
  );

  return { count: catalog.length, gzipBytes, hash, publicFileName };
}
