"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/animate-ui/components/radix/sidebar";

import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";

export const SidebarRight = () => {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;

  return (
    <SidebarProvider open={!!activePokemon}>
      <Sidebar collapsible="icon" side="right">
        <SidebarContent>
          {activePokemon ? <p>{activePokemon}</p> : <p></p>}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};
