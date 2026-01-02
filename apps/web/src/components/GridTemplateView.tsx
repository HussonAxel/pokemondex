import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export function GridTemplateView({ itemCount = 30, columns = 6 }) {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const rows = Math.ceil(itemCount / columns);

  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });
  return (
    <div
      className="grid gap-4 p-4 flex-1 overflow-auto"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {items.map((item) => (
        <div
          key={item}
          className="bg-sidebar-border  flex items-center justify-center rounded-lg ring-1 ring-accent text-white hover:scale-[1.02] hover:bg-sidebar/40 active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer group"
          onClick={() =>
            navigate({
              to: ".",
              search: {
                ...searchParams,
                activePokemon: item.toString(),
              },
            })
          }
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item}.png`}
            alt=""
            className="w-24 h-24 group-hover:scale-120 transition-all duration-300 ease-in-out"
          />
          <div className="relative top-0 right-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
