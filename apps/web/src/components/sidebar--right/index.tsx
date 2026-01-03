"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/animate-ui/components/radix/sidebar";

import SidebarMainTab from "@/components/sidebar--right/mainTab";

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
          "--sidebar-width": "24rem",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" side="right">
        <SidebarContent>
          <SidebarMainTab />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};
