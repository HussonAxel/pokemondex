import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { SidebarTop } from "@/components/sidebar-top";
import { SidebarBottom } from "@/components/sidebar-bottom";
import { GridTemplateView } from "@/components/GridTemplateView";
import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: z.object({
    view: z.enum(["grid", "list"]).optional(),
    search: z.string().optional(),
    activePokemon: z
      .string()
      .optional()
      .transform((val) =>
        val ? decodeURIComponent(val.replace(/\+/g, " ")) : undefined
      ),
    shinyView: z.boolean().optional(),
    catchedView: z.boolean().optional(),
    page: z.number().optional(),
  }),
  loader: async ({ context }) => {
    const pokemons = await context.queryClient.ensureQueryData(
      orpc.getPokemons.queryOptions({
        staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
        gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    );
    return { pokemons };
  },
});

function HomeComponent() {
  const searchParams = useSearch({ from: Route.id });
  const { pokemons } = useLoaderData({ from: Route.id });
  console.log(pokemons);
  const isGrid = searchParams.view === "grid" || !searchParams.view;

  return (
    <div className="flex flex-col h-full">
      <SidebarTop />
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {isGrid ? <GridTemplateView /> : <ListTemplateView />}
      </div>
      <SidebarBottom />
    </div>
  );
}
