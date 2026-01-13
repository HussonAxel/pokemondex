import type { RouterClient } from "@orpc/server";
import { eq } from "drizzle-orm";

import { protectedProcedure, publicProcedure } from "../index";
import { db, pokemon } from "@my-better-t-app/db";
import z from "zod";

const DEFAULT_POKEAPI_URL = "https://pokeapi.co/api/v2";
const DEFAULT_POKEAPI_LIMIT = "pokemon?limit=-1&offset=0";

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
      abilities: p.abilities,
      species: p.species,
      isDefault: p.isDefault,
    }));

    return { results };
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
      let pokemonData;

      pokemonData = await db
        .select()
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
        generation: p.generation,
        abilities: p.abilities || [],
        pastAbilities: p.pastAbilities || [],
        forms: p.forms || [],
        heldItems: p.heldItems || [],
        species: p.species,
        cries: p.cries,
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
      const response = await fetch(input.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon species data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
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
      const response = await fetch(input.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon growth rate data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    })
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
