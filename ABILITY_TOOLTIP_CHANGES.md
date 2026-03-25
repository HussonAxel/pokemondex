# Ability Tooltip Changes

## Goal

Afficher le detail d'un talent dans le tooltip au survol, en reutilisant l'architecture existante du projet:

- fetch serveur via `orpc`
- cache client via `@tanstack/react-query`
- prechargement a l'intention utilisateur sur `hover` / `focus`

## What Changed

### 1. Added a dedicated ORPC endpoint for ability details

File:

- `packages/api/src/routers/index.ts`

New endpoint:

- `getPokemonAbilityData`

Input:

- `url: string`

Behavior:

- fetch l'URL PokeAPI de l'ability
- extrait seulement les champs utiles au tooltip
- normalise les textes pour eviter d'envoyer toute la payload brute au client

Returned shape:

```ts
{
  name: string
  shortEffect: string | null
  effect: string | null
  flavorText: string | null
  generation: string | null
}
```

Important implementation detail:

- la PokeAPI renvoie plusieurs langues
- j'ai mis une priorite `fr`, puis fallback `en`, puis fallback "premiere entree disponible"
- les textes sont nettoyes avec `replace(/\s+/g, " ").trim()` pour enlever les retours ligne et espaces multiples

Pourquoi faire ce nettoyage cote serveur:

- le composant React reste simple
- la couche data expose un contrat stable
- si demain la source change, le tooltip n'a pas besoin d'etre reecrit

### 2. Replaced the simple ability tooltip with a data-driven tooltip

File:

- `apps/web/src/components/sidebarRight/overview.tsx`

Avant:

- le tooltip affichait seulement:
  - `Capacite : nom`
  - ou `Capacite cachee : nom`

Maintenant:

- chaque talent utilise un composant `AbilityTooltipCard`
- le trigger precharge les donnees au `hover` et au `focus`
- le popup affiche:
  - le nom du talent
  - le type de talent (`Ability` ou `Hidden ability`)
  - le `shortEffect`
  - le `effect` complet ou un fallback
  - la generation d'introduction si disponible

### 3. Added intent-based prefetch

Toujours dans:

- `apps/web/src/components/sidebarRight/overview.tsx`

Le composant `AbilityTooltipCard` fait:

```ts
queryClient.prefetchQuery(...)
```

sur:

- `onMouseEnter`
- `onFocus`

La logique verifie d'abord l'etat du cache:

- si la query n'existe pas, on prefetch
- si elle existe mais est trop vieille, on prefetch a nouveau
- sinon on reutilise le cache

Configuration retenue:

- `staleTime: 30 minutes`
- `gcTime: 60 minutes`

Pourquoi:

- les details d'une ability changent tres rarement
- le tooltip doit paraitre instantane apres le premier hover

### 4. Added a small tooltip content component

Composant ajoute:

- `AbilityTooltipContent`

Role:

- lire la query `orpc.getPokemonAbilityData`
- afficher un etat de chargement simple
- afficher un fallback si aucun detail n'est disponible

L'idee est de separer:

- le trigger et le prefetch
- le rendu du contenu

Ca rend le composant plus facile a refaire plus tard.

## Step-by-Step To Rebuild It Yourself

### Step 1. Create a server endpoint for the ability

Dans le routeur API:

1. ajoute une procedure publique `getPokemonAbilityData`
2. prends une `url` en entree
3. fais `fetch(url)`
4. lis `effect_entries`
5. choisis la meilleure langue:
   - `fr`
   - sinon `en`
   - sinon premiere entree disponible
6. retourne seulement les champs utiles au tooltip

Tu peux reprendre cette idee de selection:

```ts
const preferredLanguages = ["fr", "en"];
```

Puis:

```ts
entries.find((entry) => entry.language?.name === language)
```

### Step 2. Build a tooltip card per ability

Dans le composant qui liste les talents:

1. recupere `ability.ability.name`
2. recupere `ability.ability.url`
3. recupere `ability.is_hidden`
4. rends un composant dedie par talent

Pourquoi un composant dedie:

- chaque talent a sa propre query
- chaque talent a sa propre logique d'ouverture
- le code de la map reste lisible

### Step 3. Prefetch on hover/focus

Dans ce composant:

1. utilise `useQueryClient()`
2. cree `queryOptions` avec `orpc.getPokemonAbilityData.queryOptions(...)`
3. attache `prefetchAbility` a:
   - `onMouseEnter`
   - `onFocus`

Le principe:

```ts
const state = queryClient.getQueryState(queryOptions.queryKey);
```

Puis:

```ts
queryClient.prefetchQuery({
  ...queryOptions,
  staleTime,
  gcTime,
});
```

### Step 4. Render the tooltip content with `useQuery`

Dans le contenu du tooltip:

1. fais un `useQuery` avec les memes `queryOptions`
2. garde les memes `staleTime` / `gcTime`
3. affiche:
   - loading
   - detail
   - fallback

Le point important:

- le `prefetch` remplit souvent deja le cache avant l'ouverture du tooltip
- donc l'utilisateur voit les details presque instantanement

## Why This Approach Fits This Project

Cette solution suit les patterns deja presents dans le repo:

- `orpc` pour la couche data
- `react-query` pour le cache client
- prefetch a l'intention utilisateur deja utilise ailleurs

Ce que j'ai volontairement evite:

- charger tous les details d'abilities dans le loader de route
- fetcher directement PokeAPI depuis le navigateur
- garder la payload PokeAPI brute dans le composant

## Files Modified

- `packages/api/src/routers/index.ts`
- `apps/web/src/components/sidebarRight/overview.tsx`

## Suggested Next Improvements

- traduire tous les labels UI du tooltip en francais ou en anglais de maniere coherente
- afficher un badge visuel pour `Hidden ability`
- mutualiser la logique de prefetch de ressources PokeAPI si tu ajoutes ensuite `move`, `item` ou `type`
