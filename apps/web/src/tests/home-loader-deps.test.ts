import { getHomeLoaderDeps } from "@/routes/index";

describe("getHomeLoaderDeps", () => {
  it("tracks the search params that should reload the catalog", () => {
    expect(
      getHomeLoaderDeps({
        search: {
          ability: ["blaze"],
          abilityOperator: "is_not_any_of",
          bstOperator: "between",
          activePokemon: 25,
          catchedView: true,
          collection: "starters",
          collectionOperator: "is_not",
          filterJoin: "or",
          generation: 1,
          generationOperator: "is_not",
          minBst: 300,
          maxBst: 600,
          page: 2,
          search: "pikachu",
          shinyView: true,
          type: ["electric"],
          typeOperator: "is_any_of",
          view: "list",
        },
      }),
    ).toEqual({
      ability: ["blaze"],
      abilityOperator: "is_not_any_of",
      bstOperator: "between",
      collection: "starters",
      collectionOperator: "is_not",
      filterJoin: "or",
      generation: 1,
      generationOperator: "is_not",
      maxBst: 600,
      minBst: 300,
      page: 2,
      search: "pikachu",
      type: ["electric"],
      typeOperator: "is_any_of",
    });
  });

  it("ignores presentation-only search params", () => {
    const baseSearch = getHomeLoaderDeps({ search: { page: 3 } });
    const presentationSearch = getHomeLoaderDeps({
      search: {
        page: 3,
        activePokemon: 25,
        catchedView: true,
        shinyView: true,
        view: "grid",
      },
    });

    expect(presentationSearch).toEqual(baseSearch);
  });
});
