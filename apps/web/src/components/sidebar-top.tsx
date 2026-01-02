import { LayoutGrid, List, SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export const SidebarTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });
  return (
    <div className="w-full h-[64px] bg-sidebar border-b border-border items-center px-4 flex flex-row gap-8">
      <div className="flex flex-row gap-1 rounded-lg bg-sidebar-accent/30 p-1 items-center justify text-center">
        <Link
          to="/"
          search={{ ...searchParams, view: "grid" }}
          className="p-1 rounded-md transition-all duration-300 opacity-40 hover:opacity-80"
          activeProps={{
            className:
              "text-accent-foreground opacity-100 bg-sidebar-accent/60 rounded-sm transition-all duration-300",
          }}
        >
          <LayoutGrid className="w-4 h-4" />
        </Link>
        <Separator
          className="w-px h-4 bg-border opacity-60 self-center!"
          orientation="vertical"
        />
        <Link
          to="/"
          search={{ ...searchParams, view: "list" }}
          className="p-1 rounded-md transition-all duration-300 opacity-40 hover:opacity-80"
          activeProps={{
            className:
              "text-accent-foreground opacity-100 bg-sidebar-accent/60 rounded-sm transition-all duration-300",
          }}
        >
          <List className="w-4 h-4" />
        </Link>
      </div>
      <InputGroup className="flex-1 rounded-lg bg-sidebar-accent">
        <InputGroupInput
          placeholder={searchParams.search || "Search..."}
          value={searchParams.search || ""}
          onChange={(e) => {
            const value = e.target.value;
            navigate({
              search: (prev) => ({
                ...prev,
                search: value || undefined,
              }),
              replace: true,
            });
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
