import type { RouterClient } from "@orpc/server";
import { eq, inArray, sql } from "drizzle-orm";

import { db, pokemon } from "@my-better-t-app/db";
import z from "zod";
import { fetchPokeApiJson } from "../pokeapi";
import { protectedProcedure, publicProcedure } from "../index";

const DEFAULT_POKEAPI_URL = "https://pokeapi.co/api/v2";
const DEFAULT_POKEAPI_LIMIT = "pokemon?limit=-1&offset=0";

type PokemonVariety = {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  };
};

type PokeApiLanguageEntry = {
  name: string;
};

type PokeApiVerboseEffectEntry = {
  effect?: string;
  short_effect?: string;
  language?: PokeApiLanguageEntry;
};

type PokeApiAbilityPayload = {
  name?: string;
  effect_entries?: PokeApiVerboseEffectEntry[];
  flavor_text_entries?: Array<{
    flavor_text?: string;
    language?: PokeApiLanguageEntry;
  }>;
  generation?: {
    name?: string;
  };
};

function getLocalizedAbilityText(
  entries: PokeApiVerboseEffectEntry[] | undefined,
  key: "effect" | "short_effect",
) {
  if (!entries?.length) {
    return null;
  }

  const preferredLanguages = ["fr", "en"];

  for (const language of preferredLanguages) {
    const match = entries.find(
      (entry) => entry.language?.name === language && entry[key],
    );

    if (match?.[key]) {
      return match[key]!.replace(/\s+/g, " ").trim();
    }
  }

  const fallback = entries.find((entry) => entry[key]);
  return fallback?.[key]?.replace(/\s+/g, " ").trim() ?? null;
}

function getLocalizedFlavorText(
  entries: PokeApiAbilityPayload["flavor_text_entries"],
) {
  if (!entries?.length) {
    return null;
  }

  const preferredLanguages = ["fr", "en"];

  for (const language of preferredLanguages) {
    const match = entries.find(
      (entry) => entry.language?.name === language && entry.flavor_text,
    );

    if (match?.flavor_text) {
      return match.flavor_text.replace(/\s+/g, " ").trim();
    }
  }

  const fallback = entries.find((entry) => entry.flavor_text);
  return fallback?.flavor_text?.replace(/\s+/g, " ").trim() ?? null;
}

async function getSpeciesVarieties(speciesUrl?: string | null) {
  if (!speciesUrl) {
    return [] as PokemonVariety[];
  }

  const data = await fetchPokeApiJson<{
    varieties?: PokemonVariety[];
  }>(speciesUrl);

  return data.varieties ?? [];
}

function normalizeSearchTerms(search?: string) {
  if (!search) {
    return [];
  }

  return search
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  getPokemons: publicProcedure.handler(async () => {
    const response = await fetch(
      `${DEFAULT_POKEAPI_URL}/${DEFAULT_POKEAPI_LIMIT}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
    }
    const data = await response.json();
    return data as { results: { name: string; url: string }[] };
  }),
  getPokemonsMainData: publicProcedure.handler(async () => {
    const pokemons = await db
      .select({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        generation: pokemon.generation,
        stats: pokemon.stats,
        statsDetails: pokemon.statsDetails,
        abilities: pokemon.abilities,
        species: pokemon.species,
        isDefault: pokemon.isDefault,
      })
      .from(pokemon)
      .orderBy(pokemon.id);

    const results = pokemons.map((p) => ({
      id: p.id,
      name: p.name,
      types: p.types || [],
      generation: p.generation,
      stats: p.stats,
      statsDetails: p.statsDetails,
      abilities: p.abilities,
      species: p.species,
      isDefault: p.isDefault,
    }));

    return { results };
  }),
  getPokemonsCatalog: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(30),
        search: z.string().optional(),
        type: z.array(z.string()).max(2).optional(),
        ability: z.array(z.string()).max(3).optional(),
        collection: z.string().optional(),
        pokemonIds: z.array(z.number().int().positive()).optional(),
        shinyView: z.boolean().optional(),
        catchedView: z.boolean().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const searchTerms = normalizeSearchTerms(input.search);
      const offset = (input.page - 1) * input.pageSize;
      const whereClauses = [];

      if (input.pokemonIds?.length) {
        whereClauses.push(inArray(pokemon.id, input.pokemonIds));
      }

      for (const term of searchTerms) {
        const pattern = `%${term}%`;
        whereClauses.push(sql`
          (
            CAST(${pokemon.id} AS text) ILIKE ${pattern}
            OR ${pokemon.name} ILIKE ${pattern}
            OR EXISTS (
              SELECT 1
              FROM jsonb_array_elements_text(COALESCE(${pokemon.types}, '[]'::jsonb)) AS type_elem
              WHERE type_elem ILIKE ${pattern}
            )
            OR EXISTS (
              SELECT 1
              FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
              WHERE ability_elem->'ability'->>'name' ILIKE ${pattern}
            )
          )
        `);
      }

      if (input.type?.length) {
        whereClauses.push(
          sql`COALESCE(${pokemon.types}, '[]'::jsonb) @> ${JSON.stringify(input.type)}::jsonb`,
        );
      }

      for (const ability of input.ability ?? []) {
        whereClauses.push(sql`
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
            WHERE ability_elem->'ability'->>'name' = ${ability}
          )
        `);
      }

      const whereSql = whereClauses.length
        ? sql`WHERE ${sql.join(whereClauses, sql` AND `)}`
        : sql``;

      const countResult = await db.execute<{ count: number }>(sql`
        SELECT COUNT(*)::int AS count
        FROM ${pokemon}
        ${whereSql}
      `);

      const catalogRows = await db.execute<{
        id: number;
        name: string;
        types: string[] | null;
        visibleAbilityNames: string[] | null;
        hiddenAbilityNames: string[] | null;
        bst: number;
        generation: number | null;
        speciesUrl: string | null;
      }>(sql`
        SELECT
          ${pokemon.id} AS id,
          ${pokemon.name} AS name,
          COALESCE(${pokemon.types}, '[]'::jsonb) AS types,
          ARRAY(
            SELECT ability_elem->'ability'->>'name'
            FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
            WHERE COALESCE((ability_elem->>'is_hidden')::boolean, false) = false
          ) AS "visibleAbilityNames",
          ARRAY(
            SELECT ability_elem->'ability'->>'name'
            FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
            WHERE COALESCE((ability_elem->>'is_hidden')::boolean, false) = true
          ) AS "hiddenAbilityNames",
          (
            COALESCE((${pokemon.stats}->>'hp')::int, 0)
            + COALESCE((${pokemon.stats}->>'attack')::int, 0)
            + COALESCE((${pokemon.stats}->>'defense')::int, 0)
            + COALESCE((${pokemon.stats}->>'specialAttack')::int, 0)
            + COALESCE((${pokemon.stats}->>'specialDefense')::int, 0)
            + COALESCE((${pokemon.stats}->>'speed')::int, 0)
          )::int AS bst,
          ${pokemon.generation} AS generation,
          ${pokemon.species}->>'url' AS "speciesUrl"
        FROM ${pokemon}
        ${whereSql}
        ORDER BY ${pokemon.id}
        LIMIT ${input.pageSize}
        OFFSET ${offset}
      `);

      const total = countResult.rows[0]?.count ?? 0;
      const items = catalogRows.rows.map((entry) => ({
        id: entry.id,
        name: entry.name,
        types: entry.types ?? [],
        visibleAbilityNames: entry.visibleAbilityNames ?? [],
        hiddenAbilityNames: entry.hiddenAbilityNames ?? [],
        bst: entry.bst,
        generation: entry.generation,
        speciesUrl: entry.speciesUrl,
      }));

      return {
        items,
        total,
        page: input.page,
        pageSize: input.pageSize,
      };
    }),
  getPokemonOverview: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
      }).refine((data) => data.id !== undefined, {
        message: "ID must be provided",
      })
    )
    .handler(async ({ input }) => {
      const pokemonData = await db
        .select({
          id: pokemon.id,
          name: pokemon.name,
          spriteUrl: pokemon.spriteUrl,
          officialArtworkUrl: pokemon.officialArtworkUrl,
          height: pokemon.height,
          weight: pokemon.weight,
          baseExperience: pokemon.baseExperience,
          order: pokemon.order,
          isDefault: pokemon.isDefault,
          types: pokemon.types,
          pastTypes: pokemon.pastTypes,
          stats: pokemon.stats,
          statsDetails: pokemon.statsDetails,
          generation: pokemon.generation,
          abilities: pokemon.abilities,
          pastAbilities: pokemon.pastAbilities,
          moves: pokemon.moves,
          forms: pokemon.forms,
          gameIndices: pokemon.gameIndices,
          heldItems: pokemon.heldItems,
          species: pokemon.species,
          cries: pokemon.cries,
          locationAreaEncounters: pokemon.locationAreaEncounters,
          sprites: pokemon.sprites,
        })
        .from(pokemon)
        .where(eq(pokemon.id, input.id || 0))
        .limit(1);

      if (!pokemonData || pokemonData.length === 0) {
        throw new Error(
          `Pokémon not found with ${`id: ${input.id}`}`
        );
      }

      const p = pokemonData[0]!;
      const varieties = await getSpeciesVarieties(p.species?.url);

      return {
        id: p.id,
        name: p.name,
        spriteUrl: p.spriteUrl,
        officialArtworkUrl: p.officialArtworkUrl,
        height: p.height,
        weight: p.weight,
        baseExperience: p.baseExperience,
        order: p.order,
        isDefault: p.isDefault,
        types: p.types || [],
        pastTypes: p.pastTypes || [],
        stats: p.stats,
        statsDetails: p.statsDetails,
        generation: p.generation,
        abilities: p.abilities || [],
        pastAbilities: p.pastAbilities || [],
        moves: p.moves || [],
        forms: p.forms || [],
        varieties,
        gameIndices: p.gameIndices || [],
        heldItems: p.heldItems || [],
        species: p.species,
        cries: p.cries,
        locationAreaEncounters: p.locationAreaEncounters,
        sprites: p.sprites,
      };
    }),
  getPokemonSpeciesData: publicProcedure 
    .input(
      z.object({
        url: z.string()
      }).refine((data) => data.url !== undefined, {
        message: "URL must be provided",
      })
    )
    .handler( async ({
      input
    }) => {
      const data = await fetchPokeApiJson(input.url);
      return data;
    }),
  getPokemonAbilityData: publicProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .handler(async ({ input }) => {
      const data = await fetchPokeApiJson<PokeApiAbilityPayload>(input.url);
      const shortEffect = getLocalizedAbilityText(
        data.effect_entries,
        "short_effect",
      );
      const effect = getLocalizedAbilityText(data.effect_entries, "effect");
      const flavorText = getLocalizedFlavorText(data.flavor_text_entries);

      return {
        name: data.name ?? "",
        shortEffect,
        effect,
        flavorText,
        generation: data.generation?.name ?? null,
      };
    }),

  getPokemonGrowthRateData: publicProcedure
    .input( 
      z.object({
        url: z.string()
      }).refine((data) => data.url !== undefined, { 
        message: "URL must be provided",
      })
    )
    .handler( async ({ input }) => {
      const data = await fetchPokeApiJson(input.url);
      return data;
    })
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
