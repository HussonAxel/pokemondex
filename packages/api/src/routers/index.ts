import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { db, pokemon } from "@my-better-t-app/db";

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
    }));

    return { results };
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
