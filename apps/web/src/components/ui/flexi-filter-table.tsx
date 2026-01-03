import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";

import { MoreVertical } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import { cn } from "@/lib/utils";
import BadgeTypes from "./badge-type";
import { data as defaultData } from "@/data/data";

export default function FlexiFilterTable() {
  const [data] = useState<typeof defaultData>(defaultData);
  const searchParams = useSearch({ from: Route.id });
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;
  const navigate = useNavigate({ from: Route.id });

  const filteredData = useMemo(() => {
    if (!searchParams.search) {
      return data;
    }

    const searchTerms = searchParams.search
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter((term) => term.length > 0);

    console.log(searchTerms);

    return data.filter((item: (typeof defaultData)[0]) => {
      const searchable = `${
        item.name
      } ${`GEN ${item.generation}`} ${`TYPE ${item.firstType} ${item.secondType}`} ${`BALANCE ${item.balance}`}`.toLowerCase();

      return searchTerms.every((term) => searchable.includes(term));
    });
  }, [data, searchParams.search]);

  return (
    <div className="bg-background overflow-hidden p-4 h-full flex flex-col">
      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-hide rounded-xl border border-border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 overflow-y-auto">
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>TYPE(S)</TableHead>
              <TableHead>LEVEL</TableHead>
              <TableHead>STATS</TableHead>
              <TableHead>BALANCE</TableHead>
              <TableHead>JOINED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row: (typeof defaultData)[0]) => {
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-muted/30 cursor-pointer",
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
                  <TableCell className="flex items-center font-semibold text-[16px] gap-4">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                        isShinyView ? "shiny/" + row.id : row.id
                      }.png`}
                      alt=""
                      className="w-12 h-12 bg-sidebar-border rounded-sm p-1"
                    />
                    <div className="flex flex-col">
                      {row.name}
                      <p className="text-[13px] text-accent-foreground/60 font-normal">
                        #{row.id.toString().padStart(4, "0")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>GEN {row.generation}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BadgeTypes
                        pokemonTypes={
                          row.secondType
                            ? [
                                row.firstType.toLowerCase(),
                                row.secondType.toLowerCase(),
                              ]
                            : [row.firstType.toLowerCase()]
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Progress max={2000} value={row.balance}>
                      <ProgressTrack>
                        <ProgressIndicator className="bg-sidebar-primary" />
                      </ProgressTrack>
                    </Progress>
                  </TableCell>
                  <TableCell>{row.joined.toDateString()}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
