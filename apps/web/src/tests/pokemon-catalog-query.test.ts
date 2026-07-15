import { describe, expect, it } from "vitest";
import {
  normalizeCatalogSearchTerms,
  queryPokemonCatalog,
  type PokemonCatalogItem,
} from "@my-better-t-app/catalog";

const catalog: PokemonCatalogItem[] = [
  {
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    visibleAbilityNames: ["overgrow"],
    hiddenAbilityNames: ["chlorophyll"],
    bst: 318,
    generation: 1,
    speciesUrl: "https://pokeapi.co/api/v2/pokemon-species/1/",
  },
  {
    id: 4,
    name: "charmander",
    types: ["fire"],
    visibleAbilityNames: ["blaze"],
    hiddenAbilityNames: ["solar-power"],
    bst: 309,
    generation: 1,
    speciesUrl: "https://pokeapi.co/api/v2/pokemon-species/4/",
  },
  {
    id: 6,
    name: "charizard-mega-x",
    types: ["fire", "dragon"],
    visibleAbilityNames: ["tough-claws"],
    hiddenAbilityNames: [],
    bst: 634,
    generation: 1,
    speciesUrl: "https://pokeapi.co/api/v2/pokemon-species/6/",
  },
];

describe("queryPokemonCatalog", () => {
  it("normalizes comma-separated search terms", () => {
    expect(normalizeCatalogSearchTerms(" Fire, CHAR , ,")).toEqual([
      "fire",
      "char",
    ]);
  });

  it("combines search terms and selected filters with AND semantics", () => {
    expect(
      queryPokemonCatalog(catalog, {
        page: 1,
        pageSize: 30,
        search: "char, fire",
        type: ["fire", "dragon"],
        ability: ["tough-claws"],
      }).items.map((item) => item.id),
    ).toEqual([6]);
  });

  it("searches IDs, types, visible abilities and hidden abilities", () => {
    for (const search of ["1", "poiso", "overg", "chloro"]) {
      expect(
        queryPokemonCatalog(catalog, { page: 1, pageSize: 30, search }).items
          .map((item) => item.id),
      ).toContain(1);
    }
  });

  it("applies collections before stable ID pagination", () => {
    expect(
      queryPokemonCatalog(catalog, {
        page: 2,
        pageSize: 1,
        pokemonIds: [6, 1],
      }),
    ).toMatchObject({
      items: [{ id: 6 }],
      total: 2,
      page: 2,
      pageSize: 1,
    });
  });
});
