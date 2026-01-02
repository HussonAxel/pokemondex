import { createFileRoute } from "@tanstack/react-router";
import { SidebarTop } from "@/components/sidebar-top";
import { GridTemplateView } from "@/components/GridTemplateView";
import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: z.object({
    view: z.enum(["grid", "list"]).default("grid"),
    search: z.string().optional().default(""),
  }),
});

function HomeComponent() {
  const params = useSearch({ from: Route.id });
  return (
    <div className="flex flex-col h-full">
      <SidebarTop />
      {params.view === "grid" ? <GridTemplateView /> : <ListTemplateView />}
    </div>
  );
}
