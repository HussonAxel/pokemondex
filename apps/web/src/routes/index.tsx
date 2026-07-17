import { PokemonFinder } from "@/components/pokemon-finder";
import { Button } from "@/components/ui/button";
import {
  pokemonCollectionFilterKeys,
  pokemonCollectionFilterMap,
} from "@/data/data";
import { queryPokemonCatalogIsomorphic } from "@/features/pokemon-catalog/isomorphic";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const HOME_CATALOG_PAGE_SIZE = 36;
export const HOME_CATALOG_STALE_TIME = 30 * 60 * 1000;
export const HOME_CATALOG_GC_TIME = 24 * 60 * 60 * 1000;

const homeSearchSchema = z.object({
  view: z.enum(["grid", "icons", "list", "columns", "gallery"]).optional(),
  search: z.string().optional(),
  shinyView: z.boolean().optional(),
  catchedView: z.boolean().optional(),
  page: z.number().optional(),
  type: z.array(z.string()).max(2).optional(),
  typeOperator: z.enum(["is_any_of", "includes_all", "is_not_any_of"]).optional(),
  ability: z.array(z.string()).max(3).optional(),
  abilityOperator: z.enum(["is_any_of", "includes_all", "is_not_any_of"]).optional(),
  generation: z.number().int().min(1).max(9).optional(),
  generationOperator: z.enum(["is", "is_not"]).optional(),
  minBst: z.number().int().min(0).max(1200).optional(),
  maxBst: z.number().int().min(0).max(1200).optional(),
  bstOperator: z.enum(["greater_than", "less_than", "between", "not_between", "equals", "not_equals"]).optional(),
  filterJoin: z.enum(["and", "or"]).optional(),
  collection: z.enum(pokemonCollectionFilterKeys).optional(),
  collectionOperator: z.enum(["is", "is_not"]).optional(),
});

export function getHomeLoaderDeps({
  search,
}: {
  search: z.infer<typeof homeSearchSchema>;
}) {
  return {
    ability: search.ability ?? [],
    abilityOperator: search.abilityOperator,
    bstOperator: search.bstOperator,
    collection: search.collection,
    collectionOperator: search.collectionOperator,
    filterJoin: search.filterJoin,
    generation: search.generation,
    generationOperator: search.generationOperator,
    maxBst: search.maxBst,
    minBst: search.minBst,
    page: search.page ?? 1,
    search: search.search?.trim() || undefined,
    type: search.type ?? [],
    typeOperator: search.typeOperator,
  };
}

export function getHomeCatalogInput(deps: ReturnType<typeof getHomeLoaderDeps>) {
  return {
    ...deps,
    collection: deps.collection,
    pageSize: HOME_CATALOG_PAGE_SIZE,
    pokemonIds: deps.collection
      ? pokemonCollectionFilterMap[deps.collection]?.pokemonIds
      : undefined,
    pokemonIdsOperator: deps.collectionOperator,
  };
}

export const Route = createFileRoute("/")({
  component: HomeComponent,
  errorComponent: CatalogErrorComponent,
  validateSearch: homeSearchSchema,
  loaderDeps: getHomeLoaderDeps,
  staleTime: HOME_CATALOG_STALE_TIME,
  gcTime: HOME_CATALOG_GC_TIME,
  loader: async ({ deps }) => {
    const catalog = await queryPokemonCatalogIsomorphic(
      getHomeCatalogInput(deps),
    );
    return { catalog } as const;
  },
});

function CatalogErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const retry = async () => {
    if (typeof window !== "undefined") {
      const { retryPokemonCatalogClient } = await import(
        "@/features/pokemon-catalog/client"
      );
      await retryPokemonCatalogClient();
    }
    reset();
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <p className="font-medium">The Pokemon catalog could not be loaded.</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button type="button" onClick={() => void retry()}>
          Retry
        </Button>
      </div>
    </div>
  );
}

function HomeComponent() {
  return <PokemonFinder />;
}
