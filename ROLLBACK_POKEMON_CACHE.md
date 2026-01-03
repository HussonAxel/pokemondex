# 🔄 Guide de Rollback - Retour à PokeAPI direct

Si vous souhaitez revenir à l'ancienne méthode (requêtes directes à PokeAPI), suivez ce guide.

## ⚠️ Avertissement

Cette opération supprimera **définitivement** toutes les données Pokémon stockées dans votre base de données. Assurez-vous de vouloir vraiment revenir en arrière.

## 📋 Étapes de rollback

### 1. Supprimer les tables de la base de données

**Option A : Via le script TypeScript (recommandé)**

```bash
bun run packages/db/src/scripts/cleanup-pokemon.ts
```

**Option B : Via SQL directement**

Connectez-vous à votre base de données et exécutez :

```sql
DROP TABLE IF EXISTS "pokemon" CASCADE;
DROP TABLE IF EXISTS "pokemon_sync" CASCADE;
```

**Option C : Via Drizzle Studio**

```bash
bun run db:studio
```

Puis supprimez manuellement les tables `pokemon` et `pokemon_sync`.

### 2. Supprimer le schéma Pokémon

Supprimez ou renommez le fichier :

```bash
rm packages/db/src/schema/pokemon.ts
```

### 3. Retirer l'export du schéma

Modifiez `packages/db/src/schema/index.ts` :

```typescript
// Avant
export * from "./auth";
export * from "./pokemon";

// Après
export * from "./auth";
// export * from "./pokemon"; // Supprimé
```

### 4. Restaurer l'ancienne API

Remplacez le contenu de `packages/api/src/routers/index.ts` par :

```typescript
import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";

const DEFAULT_POKEAPI_URL = "https://pokeapi.co/api/v2";
const DEFAULT_POKEAPI_LIMIT = "pokemon?limit=-1&offset=0";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  getPokemons: publicProcedure.handler(async () => {
    const response = await fetch(
      `${DEFAULT_POKEAPI_URL}/${DEFAULT_POKEAPI_LIMIT}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
    }
    const data = await response.json();
    return data as { results: { name: string; url: string }[] };
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
```

### 5. Supprimer les fichiers de synchronisation (optionnel)

Si vous ne voulez plus du tout de ces fichiers :

```bash
rm packages/api/src/sync-pokemon.ts
rm packages/api/src/scripts/sync-pokemon.ts
rm packages/db/src/scripts/cleanup-pokemon.ts
rm packages/db/src/scripts/drop-pokemon-tables.sql
```

### 6. Mettre à jour le frontend (si nécessaire)

Si vous avez modifié le frontend pour utiliser la nouvelle API, vous devrez peut-être restaurer l'ancien code de filtrage côté client.

## ✅ Vérification

1. Vérifiez que les tables ont été supprimées :
   ```bash
   bun run db:studio
   ```

2. Testez que l'API fonctionne toujours :
   ```typescript
   const result = await orpc.getPokemons.query();
   ```

3. Vérifiez que votre application fonctionne correctement.

## 🔄 Revenir à la méthode avec cache (si vous changez d'avis)

Si vous voulez réactiver le cache plus tard :

1. Restaurez les fichiers depuis Git (si vous les avez commit)
2. Ou recréez-les depuis `POKEMON_SYNC.md`
3. Relancez `bun run db:push`
4. Relancez la synchronisation

## 📝 Fichiers à supprimer/modifier

- ✅ `packages/db/src/schema/pokemon.ts` - Supprimer
- ✅ `packages/api/src/sync-pokemon.ts` - Supprimer (optionnel)
- ✅ `packages/api/src/scripts/sync-pokemon.ts` - Supprimer (optionnel)
- ✅ `packages/db/src/scripts/cleanup-pokemon.ts` - Supprimer après usage
- ✅ `packages/api/src/routers/index.ts` - Restaurer l'ancienne version
- ✅ `packages/db/src/schema/index.ts` - Retirer l'export pokemon

## 💡 Alternative : Garder les deux méthodes

Si vous n'êtes pas sûr, vous pouvez garder les deux méthodes et ajouter un flag pour basculer :

```typescript
const USE_CACHE = process.env.USE_POKEMON_CACHE === "true";

export const appRouter = {
  getPokemons: publicProcedure
    .input(/* ... */)
    .handler(async ({ input }) => {
      if (USE_CACHE) {
        // Méthode avec cache
        return await getPokemonsFromDB(input);
      } else {
        // Méthode directe PokeAPI
        return await getPokemonsFromPokeAPI(input);
      }
    }),
};
```

Puis dans `.env` :
```env
USE_POKEMON_CACHE=false  # ou true pour activer
```

