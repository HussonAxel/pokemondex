import { fetchPokeApiJson } from "../../../../packages/api/src/pokeapi";

describe("fetchPokeApiJson", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects URLs outside https://pokeapi.co/api/v2/", async () => {
    await expect(
      fetchPokeApiJson("https://example.com/api/v2/pokemon/1"),
    ).rejects.toThrow("Only pokeapi.co URLs are allowed");
  });

  it("returns a controlled timeout error when the request aborts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(Object.assign(new Error("timed out"), { name: "TimeoutError" })),
    );

    await expect(
      fetchPokeApiJson("https://pokeapi.co/api/v2/pokemon/1"),
    ).rejects.toThrow("PokeAPI request timed out");
  });

  it("serves a fresh cached payload without making another request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: "bulbasaur" }),
      })
      .mockRejectedValueOnce(new Error("network down"));

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchPokeApiJson("https://pokeapi.co/api/v2/pokemon/1"),
    ).resolves.toEqual({
      id: 1,
      name: "bulbasaur",
    });

    await expect(
      fetchPokeApiJson("https://pokeapi.co/api/v2/pokemon/1"),
    ).resolves.toEqual({
      id: 1,
      name: "bulbasaur",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
