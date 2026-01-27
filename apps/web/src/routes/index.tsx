import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import { orpc } from "@/utils/orpc";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: z.object({
    view: z.enum(["grid", "list"]).optional(),
    search: z.string().optional(),
    activePokemon: z.number().optional(),
    shinyView: z.boolean().optional(),
    catchedView: z.boolean().optional(),
    page: z.number().optional(),
  }),
  loader: async ({ context }) => {
    const Pokemons = await context.queryClient.ensureQueryData(
      orpc.getPokemonsMainData.queryOptions(),
    );
    return { Pokemons } as const;
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
