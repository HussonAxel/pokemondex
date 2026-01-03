import { useState, useMemo } from "react";
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
import { cn } from "@/lib/utils";
import { data as defaultData } from "@/data/data";

export function GridTemplateView({ columns = 6 }) {
  const [data] = useState<typeof defaultData>(defaultData);
  const searchParams = useSearch({ from: Route.id });
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;
  const navigate = useNavigate({ from: Route.id });
  const filteredData = useMemo(() => {
    if (!searchParams.search) {
      return data;
    }

    // Split by comma, trim to remove stray spaces
    const searchTerms = searchParams.search
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter((term) => term.length > 0);

    console.log(searchTerms);

    return data.filter((item: (typeof defaultData)[0]) => {
      // Stringify relevant fields into a single searchable string
      const searchable = `${
        item.name
      } ${`GEN ${item.generation}`} ${`TYPE ${item.firstType} ${item.secondType}`} ${`BALANCE ${item.balance}`}`.toLowerCase();

      // Must match ALL search terms (AND logic)
      return searchTerms.every((term) => searchable.includes(term));
    });
  }, [data, searchParams.search]);

  return (
    <div
      className="grid gap-4 h-full overflow-auto p-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {filteredData.map((row: (typeof defaultData)[0]) => (
        <div
          key={row.id}
          className={cn(
            "bg-sidebar-border flex flex-col items-center justify-center rounded-lg ring-1 ring-accent text-white hover:scale-[1.02] hover:bg-sidebar/40 active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer group relative p-4 max-h-[150px]",
            isCatchedView && !row.catched && "opacity-30"
          )}
          onClick={() =>
            navigate({
              to: ".",
              search: {
                ...searchParams,
                activePokemon: row.name,
              },
            })
          }
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              isShinyView ? "shiny/" + row.id : row.id
            }.png`}
            alt={row.name}
            className="w-24 h-24 group-hover:scale-110 transition-all duration-300 ease-in-out"
          />
          <div
            className="absolute top-2 right-2"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
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
