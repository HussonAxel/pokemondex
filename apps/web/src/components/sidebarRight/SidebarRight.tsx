"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/animate-ui/components/radix/sidebar";

import SidebarMainTab from "@/components/sidebarRight/mainTab";

import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";

export const SidebarRight = () => {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  return (
    <SidebarProvider
      open={!!activePokemon}
      style={
        {
          "--sidebar-width": "22rem",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" side="right">
        <SidebarContent>
          <div
            className={`transition-opacity duration-300 ease-in-out ${
              activePokemon ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <SidebarMainTab />
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};
