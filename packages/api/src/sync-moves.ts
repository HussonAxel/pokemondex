import { db, pokemonMove } from "@my-better-t-app/db";
import { sql } from "drizzle-orm";

import { fetchPokeApiJson } from "./pokeapi";

const POKEAPI_MOVE_LIST_URL = "https://pokeapi.co/api/v2/move?limit=-1&offset=0";
const MOVE_FETCH_CONCURRENCY = 20;
const MOVE_WRITE_BATCH_SIZE = 100;
const MOVE_FETCH_ATTEMPTS = 3;

type NamedResource = {
  name: string;
  url: string;
};

type MovePayload = {
  accuracy: number | null;
  damage_class: NamedResource;
  effect_chance: number | null;
  effect_entries?: Array<{
    language?: { name: string };
    short_effect?: string;
  }>;
  generation: NamedResource;
  id: number;
  name: string;
  power: number | null;
  pp: number | null;
  priority: number;
  type: NamedResource;
};

type MoveRecord = typeof pokemonMove.$inferInsert;

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetchWithRetry<T>(url: string) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MOVE_FETCH_ATTEMPTS; attempt++) {
    try {
      return await fetchPokeApiJson<T>(url);
    } catch (error) {
      lastError = error;
      if (attempt < MOVE_FETCH_ATTEMPTS) {
        await wait(250 * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError;
}

async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>,
) {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index]!);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, worker),
  );
  return results;
}

function getMoveEffect(move: MovePayload) {
  const effect =
    move.effect_entries?.find((entry) => entry.language?.name === "en")
      ?.short_effect ??
    move.effect_entries?.find((entry) => entry.language?.name === "fr")
      ?.short_effect ??
    move.effect_entries?.find((entry) => entry.short_effect)?.short_effect;

  return (
    effect
      ?.replace(
        /\$effect_chance/g,
        move.effect_chance?.toString() ?? "the listed",
      )
      .replace(/\s+/g, " ")
      .trim() ?? null
  );
}

function toMoveRecord(move: MovePayload): MoveRecord {
  return {
    accuracy: move.accuracy,
    damageClass: move.damage_class.name,
    effect: getMoveEffect(move),
    generation: move.generation.name,
    id: move.id,
    name: move.name,
    power: move.power,
    pp: move.pp,
    priority: move.priority,
    syncedAt: new Date(),
    type: move.type.name,
    updatedAt: new Date(),
  };
}

export async function syncPokemonMoves() {
  console.log("Fetching the PokeAPI move catalog...");
  const list = await fetchWithRetry<{
    count: number;
    results: NamedResource[];
  }>(POKEAPI_MOVE_LIST_URL);

  const records = await mapWithConcurrency(
    list.results,
    MOVE_FETCH_CONCURRENCY,
    async (move) => toMoveRecord(await fetchWithRetry<MovePayload>(move.url)),
  );

  console.log(`Saving ${records.length} moves to Postgres...`);
  for (let index = 0; index < records.length; index += MOVE_WRITE_BATCH_SIZE) {
    const batch = records.slice(index, index + MOVE_WRITE_BATCH_SIZE);
    await db
      .insert(pokemonMove)
      .values(batch)
      .onConflictDoUpdate({
        target: pokemonMove.id,
        set: {
          accuracy: sql`excluded.accuracy`,
          damageClass: sql`excluded.damage_class`,
          effect: sql`excluded.effect`,
          generation: sql`excluded.generation`,
          name: sql`excluded.name`,
          power: sql`excluded.power`,
          pp: sql`excluded.pp`,
          priority: sql`excluded.priority`,
          syncedAt: sql`excluded.synced_at`,
          type: sql`excluded.type`,
          updatedAt: sql`excluded.updated_at`,
        },
      });
  }

  console.log(`Move synchronization completed: ${records.length} saved`);
  return { success: true, total: records.length };
}
