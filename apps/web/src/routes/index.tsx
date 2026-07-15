import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import {
  pokemonCollectionFilterKeys,
  pokemonCollectionFilterMap,
} from "@/data/data";
import { orpc } from "@/utils/orpc";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const HOME_CATALOG_PAGE_SIZE = 30;
export const HOME_CATALOG_STALE_TIME = 30 * 60 * 1000;
export const HOME_CATALOG_GC_TIME = 24 * 60 * 60 * 1000;

const homeSearchSchema = z.object({
  view: z.enum(["grid", "list"]).optional(),
  search: z.string().optional(),
  activePokemon: z.number().optional(),
  shinyView: z.boolean().optional(),
  catchedView: z.boolean().optional(),
  page: z.number().optional(),
  type: z.array(z.string()).max(2).optional(),
  ability: z.array(z.string()).max(3).optional(),
  collection: z.enum(pokemonCollectionFilterKeys).optional(),
});

export function getHomeLoaderDeps({
  search,
}: {
  search: z.infer<typeof homeSearchSchema>;
}) {
  return {
    ability: search.ability ?? [],
    collection: search.collection,
    page: search.page ?? 1,
    search: search.search?.trim() || undefined,
    type: search.type ?? [],
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
  };
}

export function getHomeCatalogQueryOptions(
  deps: ReturnType<typeof getHomeLoaderDeps>,
) {
  return {
    ...orpc.getPokemonsCatalog.queryOptions({
      input: getHomeCatalogInput(deps),
    }),
    staleTime: HOME_CATALOG_STALE_TIME,
    gcTime: HOME_CATALOG_GC_TIME,
  };
}

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: homeSearchSchema,
  loaderDeps: getHomeLoaderDeps,
  staleTime: HOME_CATALOG_STALE_TIME,
  gcTime: HOME_CATALOG_GC_TIME,
  loader: async ({ context, deps }) => {
    const catalog = await context.queryClient.ensureQueryData(
      getHomeCatalogQueryOptions(deps),
    );
    return { catalog } as const;
  },
});

function HomeComponent() {
  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <ListTemplateView />
      </div>
    </div>
  );
}
