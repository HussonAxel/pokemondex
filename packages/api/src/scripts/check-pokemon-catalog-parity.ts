#!/usr/bin/env bun
import "./load-env";

const { checkPokemonCatalogParity } = await import(
  "../catalog/check-pokemon-catalog-parity"
);

try {
  console.log("Pokemon catalog parity verified:", await checkPokemonCatalogParity());
} catch (error) {
  console.error("Pokemon catalog parity failed:", error);
  process.exit(1);
}
