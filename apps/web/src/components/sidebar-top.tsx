import { LayoutGrid, List, SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export const SidebarTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });
  return (
    <div className="w-full border-border items-center flex flex-row gap-4 pb-4">
      <InputGroup className="flex-1 rounded-md bg-sidebar-accent">
        <InputGroupInput
          placeholder={
            searchParams.search !== undefined && searchParams.search !== ""
              ? searchParams.search
              : 'e.g. "fire", "fire, 100", "water, gen 3"'
          }
          value={searchParams.search || ""}
          onChange={(e) => {
            const value = e.target.value;
            navigate({
              search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1,
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
