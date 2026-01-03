import { createFileRoute } from "@tanstack/react-router";
import { SidebarTop } from "@/components/sidebar-top";
import { SidebarBottom } from "@/components/sidebar-bottom";
import { GridTemplateView } from "@/components/GridTemplateView";
import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: z.object({
    view: z.enum(["grid", "list"]).optional(),
    search: z.string().optional(),
    activePokemon: z.string().optional(),
    shinyView: z.boolean().optional(),
    catchedView: z.boolean().optional(),
  }),
});

function HomeComponent() {
  const searchParams = useSearch({ from: Route.id });
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
