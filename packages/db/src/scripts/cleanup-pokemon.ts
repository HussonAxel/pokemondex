#!/usr/bin/env bun
/**
 * Script pour nettoyer les tables Pokémon de la base de données
 * 
 * ⚠️ ATTENTION : Ce script supprime définitivement toutes les données Pokémon
 * 
 * Usage:
 *   bun run packages/db/src/scripts/cleanup-pokemon.ts
 */

// Charger les variables d'environnement AVANT d'importer les modules qui en dépendent
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Obtenir le répertoire du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le .env depuis apps/web/.env
dotenv.config({
  path: resolve(__dirname, "../../../../apps/web/.env"),
});

// Maintenant on peut importer les modules qui utilisent les variables d'environnement
import { db } from "../index";
import { sql } from "drizzle-orm";

async function cleanupPokemon() {
  console.log("🧹 Nettoyage des tables Pokémon...");

  try {
    // Supprimer les tables
    await db.execute(sql`DROP TABLE IF EXISTS "pokemon" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "pokemon_sync" CASCADE`);

    console.log("✅ Tables Pokémon supprimées avec succès");
    console.log("📝 Vous pouvez maintenant supprimer le fichier packages/db/src/schema/pokemon.ts");
    console.log("📝 Et restaurer l'ancienne méthode dans packages/api/src/routers/index.ts");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    throw error;
  }
}

cleanupPokemon()
  .then(() => {
    console.log("✨ Nettoyage terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erreur fatale:", error);
    process.exit(1);
  });

