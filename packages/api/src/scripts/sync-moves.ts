#!/usr/bin/env bun
import "./load-env";

const { syncPokemonMoves } = await import("../sync-moves");

try {
  const result = await syncPokemonMoves();
  console.log("Move synchronization succeeded:", result);
} catch (error) {
  console.error("Move synchronization failed:", error);
  process.exit(1);
}
