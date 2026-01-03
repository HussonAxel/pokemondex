"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverPopup } from "@/components/ui/popover";
import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes";
import { useNavigate } from "@tanstack/react-router";
import SidebarMainTab from "./mainTab";

export default function SidebarMobile() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  const navigate = useNavigate({ from: Route.id });
  return (
    <Popover
      open={!!activePokemon}
      onOpenChange={() => {
        navigate({
          to: ".",
          search: {
            ...searchParams,
            activePokemon: undefined,
          },
        });
      }}
    >
      <PopoverPopup
        className="xl:hidden w-3/4 max-h-[80vh] overflow-y-auto fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scrollbar-hide"
        side="bottom"
        align="center"
      >
        <PopoverClose
          aria-label="Close"
          className="absolute end-2 top-2"
          render={<Button size="icon" variant="ghost" />}
        >
          <XIcon />
        </PopoverClose>
        <SidebarMainTab />
      </PopoverPopup>
    </Popover>
  );
}
