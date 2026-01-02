import { createFileRoute } from "@tanstack/react-router";
import { SidebarTop } from "@/components/sidebar-top";
import { SidebarBottom } from "@/components/sidebar-bottom";
import { GridTemplateView } from "@/components/GridTemplateView";
import { ListTemplateView } from "@/components/ListTemplateView.tsx";
import { useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";

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
        <AnimatePresence mode="wait">
          {isGrid ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col"
            >
              <GridTemplateView />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col"
            >
              <ListTemplateView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SidebarBottom />
    </div>
  );
}
