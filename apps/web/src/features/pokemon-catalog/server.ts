import catalogJson from "@/generated/pokemon-catalog.json";
import {
  pokemonCatalogSchema,
  queryPokemonCatalog,
  type PokemonCatalogInput,
} from "@my-better-t-app/catalog";

const serverCatalog = pokemonCatalogSchema.parse(catalogJson);

export function queryServerPokemonCatalog(input: PokemonCatalogInput) {
  return queryPokemonCatalog(serverCatalog, input);
}
