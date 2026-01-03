/**
 * Charge les variables d'environnement depuis apps/web/.env
 * Ce fichier doit être importé AVANT tout autre module qui utilise @my-better-t-app/env
 */

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import dotenv from "dotenv";

// Obtenir le répertoire du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Essayer plusieurs chemins possibles pour le .env
const possiblePaths = [
  resolve(__dirname, "../../../../apps/web/.env"), // Depuis packages/api/src/scripts/
  resolve(process.cwd(), "apps/web/.env"), // Depuis la racine du projet
  resolve(process.cwd(), ".env"), // À la racine
];

let envPath: string | null = null;
for (const path of possiblePaths) {
  if (existsSync(path)) {
    envPath = path;
    break;
  }
}

if (!envPath) {
  console.error("❌ Fichier .env introuvable. Chemins testés:");
  possiblePaths.forEach((p) => console.error(`   - ${p}`));
  throw new Error("Fichier .env introuvable");
}

// Charger explicitement le .env et forcer l'override
const result = dotenv.config({
  path: envPath,
  override: true, // Override les variables existantes
});

if (result.error) {
  console.error("❌ Erreur lors du chargement du .env:", result.error);
  throw result.error;
}

console.log("📁 Variables d'environnement chargées depuis:", envPath);

