#!/usr/bin/env bun
import "./load-env";

import { generatePokemonCatalog } from "../catalog/generate-pokemon-catalog";

try {
  const result = await generatePokemonCatalog();
  console.log("Pokemon catalog generated:", result);
} catch (error) {
  console.error("Pokemon catalog generation failed:", error);
  process.exit(1);
}
