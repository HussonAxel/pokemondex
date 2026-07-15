# 🎮 Système de Synchronisation des Pokémon

Ce système permet de **cache les données Pokémon dans votre base de données locale** au lieu de faire des requêtes constantes à PokeAPI. Cela améliore considérablement les performances de votre application.

Les métadonnées des attaques sont également stockées dans la table
`pokemon_move`. Elles sont mises à jour automatiquement par `pokemon:refresh`.
Pour ne rafraîchir que ce référentiel :

```bash
bun run pokemon:moves
```

## 📋 Architecture

### Avantages
- ✅ **Performance** : Requêtes ultra-rapides depuis la base de données locale
- ✅ **Filtrage efficace** : Filtrage côté serveur avec pagination
- ✅ **Moins de requêtes externes** : Une seule synchronisation toutes les 2 semaines
- ✅ **Scalable** : Fonctionne même avec des milliers de Pokémon

### Comment ça fonctionne

1. **Synchronisation initiale** : Récupère tous les Pokémon depuis PokeAPI (une seule fois)
2. **Stockage en base** : Sauvegarde dans PostgreSQL avec tous les détails (types, stats, etc.)
3. **Requêtes locales** : Toutes les recherches/filtres utilisent la base de données locale
4. **Rafraîchissement** : Synchronisation automatique toutes les 2 semaines

## 🚀 Installation

### 1. Appliquer le schéma à la base de données

```bash
bun run db:push
```

Cela créera les tables `pokemon` et `pokemon_sync` dans votre base de données.

### 2. Synchronisation initiale

Lancez la synchronisation pour la première fois :

```bash
bun run packages/api/src/scripts/sync-pokemon.ts
```

Ou via l'API (nécessite une authentification) :

```typescript
await orpc.syncPokemons.query();
```

⚠️ **Note** : La première synchronisation peut prendre 5-10 minutes car elle récupère ~1300 Pokémon.

## 🔄 Synchronisation automatique (toutes les 2 semaines)

### Option 1 : Cron Job (recommandé)

Ajoutez dans votre crontab ou votre service de cron :

```bash
# Toutes les 2 semaines (tous les lundis à 2h du matin)
0 2 * * 0 cd /path/to/project && bun run packages/api/src/scripts/sync-pokemon.ts
```

### Option 2 : Vercel Cron (si déployé sur Vercel)

Créez `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/sync-pokemon",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

### Option 3 : Endpoint API manuel

Vous pouvez déclencher la synchronisation via l'endpoint protégé :

```typescript
// Depuis votre application
await orpc.syncPokemons.query();
```

## 📊 Utilisation de l'API

### Récupérer les Pokémon avec filtres

```typescript
// Recherche simple
const result = await orpc.getPokemons.query({
  search: "fire",
  page: 1,
  limit: 20
});

// Filtre par types
const result = await orpc.getPokemons.query({
  types: ["fire", "flying"],
  page: 1,
  limit: 20
});

// Filtre par génération
const result = await orpc.getPokemons.query({
  generation: 1,
  page: 1,
  limit: 20
});

// Combinaison de filtres
const result = await orpc.getPokemons.query({
  search: "charizard",
  types: ["fire"],
  generation: 1,
  page: 1,
  limit: 20
});
```

### Vérifier le statut de synchronisation

```typescript
const status = await orpc.getSyncStatus.query();
// Retourne: { lastSyncAt, totalPokemon, syncStatus, ... }
```

## 🔍 Format de recherche

La recherche textuelle supporte plusieurs formats :

- `"fire"` - Recherche dans le nom et les types
- `"fire, gen 1"` - Recherche avec plusieurs termes (AND logic)
- `"charizard"` - Recherche par nom
- `"gen 3"` - Recherche par génération

## 📈 Performance

### Avant (sans cache)
- ❌ 1300+ requêtes HTTP à PokeAPI pour filtrer
- ❌ ~30-60 secondes pour une recherche complexe
- ❌ Limite de rate limiting de PokeAPI

### Après (avec cache)
- ✅ 1 requête SQL optimisée
- ✅ ~50-200ms pour une recherche complexe
- ✅ Pas de limite de rate limiting
- ✅ Filtrage côté serveur avec pagination

## 🛠️ Maintenance

### Vérifier la dernière synchronisation

```typescript
const status = await orpc.getSyncStatus.query();
console.log(`Dernière sync: ${status.lastSyncAt}`);
console.log(`Total Pokémon: ${status.totalPokemon}`);
```

### Forcer une nouvelle synchronisation

```typescript
await orpc.syncPokemons.query();
```

## 📝 Structure de la base de données

### Table `pokemon`
- `id` : ID du Pokémon (1-1300+)
- `name` : Nom du Pokémon
- `types` : Array de types (JSONB) - ex: `["fire", "flying"]`
- `generation` : Génération (1-10)
- `stats` : Statistiques (JSONB)
- `spriteUrl` : URL du sprite
- `officialArtworkUrl` : URL de l'artwork officiel
- `syncedAt` : Date de dernière synchronisation

### Table `pokemon_sync`
- `lastSyncAt` : Date de dernière synchronisation
- `totalPokemon` : Nombre total de Pokémon synchronisés
- `syncStatus` : Statut (idle, running, completed, error)

## ⚠️ Notes importantes

1. **Première synchronisation** : Peut prendre 5-10 minutes
2. **Espace disque** : ~50-100 MB pour tous les Pokémon
3. **Fréquence de sync** : Recommandé toutes les 2 semaines (les nouveaux Pokémon sont rares)
4. **Rate limiting** : Le script inclut des délais pour éviter de surcharger PokeAPI

## 🐛 Dépannage

### Erreur "Table does not exist"
```bash
bun run db:push
```

### Synchronisation échoue
Vérifiez les logs et réessayez. Le script reprend automatiquement.

### Données obsolètes
Lancez une nouvelle synchronisation manuellement.

