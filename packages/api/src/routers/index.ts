import type { RouterClient } from "@orpc/server";
import { eq, inArray } from "drizzle-orm";

import { db, pokemon, pokemonMove } from "@my-better-t-app/db";
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

type PokeApiSpeciesPayload = {
  base_happiness?: number | null;
  capture_rate?: number;
  color?: { name: string; url: string } | null;
  egg_groups?: Array<{ name: string; url: string }>;
  flavor_text_entries?: Array<{
    flavor_text?: string;
    language?: PokeApiLanguageEntry;
    version?: { name: string; url: string };
  }>;
  gender_rate: number;
  genera?: Array<{
    genus: string;
    language?: PokeApiLanguageEntry;
  }>;
  growth_rate: { name: string; url: string };
  habitat?: { name: string; url: string } | null;
  hatch_counter: number;
  shape?: { name: string; url: string } | null;
  varieties?: PokemonVariety[];
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

const pokemonIdInput = z.object({
  id: z.number().int().positive(),
});

function formatMoveMetadata(move: typeof pokemonMove.$inferSelect) {
  return {
    accuracy: move.accuracy,
    category: move.damageClass,
    effect: move.effect,
    generation: move.generation,
    id: move.id,
    name: move.name,
    power: move.power,
    pp: move.pp,
    priority: move.priority,
    type: move.type,
  };
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
  getPokemonSummary: publicProcedure
    .input(pokemonIdInput)
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
          stats: pokemon.stats,
          statsDetails: pokemon.statsDetails,
          generation: pokemon.generation,
          abilities: pokemon.abilities,
          forms: pokemon.forms,
          species: pokemon.species,
          locationAreaEncounters: pokemon.locationAreaEncounters,
        })
        .from(pokemon)
        .where(eq(pokemon.id, input.id))
        .limit(1);

      if (!pokemonData || pokemonData.length === 0) {
        throw new Error(`Pokemon not found with id: ${input.id}`);
      }

      const p = pokemonData[0]!;

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
        stats: p.stats,
        statsDetails: p.statsDetails,
        generation: p.generation,
        abilities: p.abilities || [],
        forms: p.forms || [],
        species: p.species,
        locationAreaEncounters: p.locationAreaEncounters,
      };
    }),
  getPokemonTrainingData: publicProcedure
    .input(pokemonIdInput)
    .handler(async ({ input }) => {
      const pokemonData = await db
        .select({
          id: pokemon.id,
          baseExperience: pokemon.baseExperience,
          statsDetails: pokemon.statsDetails,
          gameIndices: pokemon.gameIndices,
          heldItems: pokemon.heldItems,
          species: pokemon.species,
        })
        .from(pokemon)
        .where(eq(pokemon.id, input.id))
        .limit(1);

      if (!pokemonData || pokemonData.length === 0) {
        throw new Error(`Pokemon not found with id: ${input.id}`);
      }

      const p = pokemonData[0]!;

      return {
        id: p.id,
        baseExperience: p.baseExperience,
        statsDetails: p.statsDetails,
        gameIndices: p.gameIndices || [],
        heldItems: p.heldItems || [],
        species: p.species,
      };
    }),
  getPokemonSpritesData: publicProcedure
    .input(pokemonIdInput)
    .handler(async ({ input }) => {
      const pokemonData = await db
        .select({
          id: pokemon.id,
          sprites: pokemon.sprites,
          cries: pokemon.cries,
        })
        .from(pokemon)
        .where(eq(pokemon.id, input.id))
        .limit(1);

      if (!pokemonData || pokemonData.length === 0) {
        throw new Error(`Pokemon not found with id: ${input.id}`);
      }

      const p = pokemonData[0]!;

      return {
        id: p.id,
        sprites: p.sprites,
        cries: p.cries,
      };
    }),
  getPokemonMovePoolData: publicProcedure
    .input(pokemonIdInput)
    .handler(async ({ input }) => {
      const rows = await db
        .select({ id: pokemon.id, moves: pokemon.moves })
        .from(pokemon)
        .where(eq(pokemon.id, input.id))
        .limit(1);

      if (!rows || rows.length === 0) {
        throw new Error(`Pokemon not found with id: ${input.id}`);
      }

      const moves = rows[0]?.moves ?? [];
      const names = Array.from(
        new Set(moves.map((entry) => entry.move.name)),
      );

      if (names.length === 0) {
        return { id: input.id, moves, metadata: [] };
      }

      const moveRows = await db
        .select()
        .from(pokemonMove)
        .where(inArray(pokemonMove.name, names));

      return {
        id: input.id,
        moves,
        metadata: moveRows.map(formatMoveMetadata),
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
      const data = await fetchPokeApiJson<PokeApiSpeciesPayload>(input.url);
      return data;
    }),
  getPokemonSpeciesSummary: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .handler(async ({ input }) => {
      const data = await fetchPokeApiJson<PokeApiSpeciesPayload>(input.url);

      return {
        color: data.color ?? null,
        egg_groups: data.egg_groups ?? [],
        flavor_text_entries: (data.flavor_text_entries ?? []).filter((entry) =>
          entry.language?.name === "fr" || entry.language?.name === "en",
        ),
        gender_rate: data.gender_rate,
        growth_rate: data.growth_rate,
        habitat: data.habitat ?? null,
        hatch_counter: data.hatch_counter,
        shape: data.shape ?? null,
        varieties: data.varieties ?? [],
      };
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

  getPokemonMoveData: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .handler(async ({ input }) => {
      const rows = await db
        .select({ moves: pokemon.moves })
        .from(pokemon)
        .where(eq(pokemon.id, input.id))
        .limit(1);
      const moves = rows[0]?.moves ?? [];
      const names = Array.from(
        new Set(moves.map((entry) => entry.move.name)),
      );

      if (names.length === 0) {
        return [];
      }

      const moveRows = await db
        .select()
        .from(pokemonMove)
        .where(inArray(pokemonMove.name, names));

      return moveRows.map(formatMoveMetadata);
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
