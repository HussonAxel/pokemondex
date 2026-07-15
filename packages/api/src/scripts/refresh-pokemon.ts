#!/usr/bin/env bun
import "./load-env";

const [{ syncPokemon }, { generatePokemonCatalog }] = await Promise.all([
  import("../sync-pokemon"),
  import("../catalog/generate-pokemon-catalog"),
]);

try {
  const syncResult = await syncPokemon();
  const catalogResult = await generatePokemonCatalog();
  const { checkPokemonCatalogParity } = await import(
    "../catalog/check-pokemon-catalog-parity"
  );
  const parityResult = await checkPokemonCatalogParity();
  console.log("Pokemon refresh completed:", {
    syncResult,
    catalogResult,
    parityResult,
  });
} catch (error) {
  console.error("Pokemon refresh failed:", error);
  process.exit(1);
}
