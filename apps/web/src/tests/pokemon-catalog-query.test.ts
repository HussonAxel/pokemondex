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

  it("filters by generation and base stat bounds", () => {
    expect(
      queryPokemonCatalog(catalog, {
        page: 1,
        pageSize: 30,
        generation: 1,
        minBst: 400,
        maxBst: 650,
      }).items.map((item) => item.id),
    ).toEqual([6]);
  });

  it("supports any, all and none operators for multi-value fields", () => {
    const queryTypes = (typeOperator: "is_any_of" | "includes_all" | "is_not_any_of") =>
      queryPokemonCatalog(catalog, {
        page: 1,
        pageSize: 30,
        type: ["fire", "dragon"],
        typeOperator,
      }).items.map((item) => item.id);

    expect(queryTypes("is_any_of")).toEqual([4, 6]);
    expect(queryTypes("includes_all")).toEqual([6]);
    expect(queryTypes("is_not_any_of")).toEqual([1]);
  });

  it("combines independent filters with global AND or OR semantics", () => {
    const input = {
      page: 1,
      pageSize: 30,
      type: ["grass"],
      generation: 1,
      generationOperator: "is_not" as const,
    };

    expect(queryPokemonCatalog(catalog, input).items).toEqual([]);
    expect(
      queryPokemonCatalog(catalog, { ...input, filterJoin: "or" }).items.map((item) => item.id),
    ).toEqual([1]);
  });

  it("supports inverse and equality base-stat operators", () => {
    expect(
      queryPokemonCatalog(catalog, {
        page: 1,
        pageSize: 30,
        minBst: 309,
        bstOperator: "equals",
      }).items.map((item) => item.id),
    ).toEqual([4]);
    expect(
      queryPokemonCatalog(catalog, {
        page: 1,
        pageSize: 30,
        minBst: 300,
        maxBst: 400,
        bstOperator: "not_between",
      }).items.map((item) => item.id),
    ).toEqual([6]);
  });
});
