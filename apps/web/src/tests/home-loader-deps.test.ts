import { getHomeLoaderDeps } from "@/routes/index";

describe("getHomeLoaderDeps", () => {
  it("tracks the search params that should reload the catalog", () => {
    expect(
      getHomeLoaderDeps({
        search: {
          ability: ["blaze"],
          activePokemon: 25,
          catchedView: true,
          collection: "starters",
          page: 2,
          search: "pikachu",
          shinyView: true,
          type: ["electric"],
          view: "list",
        },
      }),
    ).toEqual({
      ability: ["blaze"],
      collection: "starters",
      page: 2,
      search: "pikachu",
      type: ["electric"],
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
