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
    const Pokemons = await context.queryClient.ensureQueryData(
      orpc.getPokemonsMainData.queryOptions()
    );
    return { Pokemons } as const;
  },
});

function HomeComponent() {
  const searchParams = useSearch({ from: Route.id });
  const { Pokemons } = useLoaderData({ from: Route.id });
  console.log(Pokemons);
  const isList = searchParams.view === "list" || !searchParams.view;

  return (
    <div className="flex flex-col h-full">
      <SidebarTop />
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {isList ? <ListTemplateView /> : <GridTemplateView />}
      </div>
      <SidebarBottom />
    </div>
  );
}
