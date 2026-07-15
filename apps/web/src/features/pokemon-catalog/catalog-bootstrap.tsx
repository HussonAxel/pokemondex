import { useEffect } from "react";

export function PokemonCatalogBootstrap() {
  useEffect(() => {
    void import("./client")
      .then(({ startPokemonCatalogClient }) => startPokemonCatalogClient())
      .catch(() => undefined);
  }, []);

  return null;
}
