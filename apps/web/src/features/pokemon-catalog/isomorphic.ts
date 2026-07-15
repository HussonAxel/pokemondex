import { createIsomorphicFn } from "@tanstack/react-start";
import type { PokemonCatalogInput } from "@my-better-t-app/catalog";

export const queryPokemonCatalogIsomorphic = createIsomorphicFn()
  .server(async (input: PokemonCatalogInput) => {
    const { queryServerPokemonCatalog } = await import("./server");
    return queryServerPokemonCatalog(input);
  })
  .client(async (input: PokemonCatalogInput) => {
    const { queryClientPokemonCatalog } = await import("./client");
    return queryClientPokemonCatalog(input);
  });
