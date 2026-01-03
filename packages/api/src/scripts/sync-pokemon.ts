#!/usr/bin/env bun
/**
 * Script pour synchroniser les Pokémon depuis PokeAPI vers la base de données
 *
 * Usage:
 *   bun run packages/api/src/scripts/sync-pokemon.ts
 *
 * Ce script peut être exécuté:
 * - Manuellement
 * - Via un cron job (toutes les 2 semaines)
 * - Via un endpoint API (pour déclencher depuis l'admin)
 */

// IMPORTANT: Charger les variables d'environnement AVANT tout autre import
// Ce import doit être le premier pour charger le .env avant que @my-better-t-app/env ne s'exécute
import "./load-env";

// Maintenant on peut importer les modules qui utilisent les variables d'environnement
import { syncPokemon } from "../sync-pokemon";

async function main() {
  console.log("🚀 Lancement de la synchronisation des Pokémon...");
  try {
    const result = await syncPokemon();
    console.log("✅ Synchronisation réussie:", result);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
    process.exit(1);
  }
}

main();
