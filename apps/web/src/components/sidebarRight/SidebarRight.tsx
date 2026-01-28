import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/animate-ui/components/radix/sidebar";

import SidebarMainTab from "@/components/sidebarRight/mainTab";

import { Route } from "@/routes/index";
import { useSearch } from "@tanstack/react-router";

export const SidebarRight = () => {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  return (
    <SidebarProvider
      open={!!activePokemon}
      className="hidden xl:block"
      style={
        {
          "--sidebar-width": "26rem",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" side="right">
        <SidebarContent>
          <div
            className={`transition-opacity duration-300 ease-in-out border rounded-sm my-auto mr-2 h-full ${
              activePokemon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <SidebarMainTab />
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
