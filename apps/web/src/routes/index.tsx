import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import {
  pokemonCollectionFilterKeys,
  pokemonCollectionFilterMap,
} from "@/data/data";
import { orpc } from "@/utils/orpc";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const HOME_CATALOG_PAGE_SIZE = 30;

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
    catchedView: search.catchedView ?? false,
    collection: search.collection,
    page: search.page ?? 1,
    search: search.search?.trim() || undefined,
    shinyView: search.shinyView ?? false,
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

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: homeSearchSchema,
  loaderDeps: getHomeLoaderDeps,
  loader: async ({ context, deps }) => {
    const catalog = await context.queryClient.ensureQueryData(
      orpc.getPokemonsCatalog.queryOptions({
        input: getHomeCatalogInput(deps),
      }),
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
