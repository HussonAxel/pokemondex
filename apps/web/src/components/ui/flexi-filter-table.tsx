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

const defaultData = [
  {
    id: 1,
    name: "Alex Thompson",
    generation: "1",
    location: "San Francisco",
    firstType: "Fire",
    secondType: "Flying",
    balance: 1250,
    joined: new Date(2023, 3, 10),
    catched: true,
  },
  {
    id: 2,
    name: "Sarah Chen",
    generation: "2",
    location: "Singapore",
    firstType: "Water",
    secondType: "Ice",
    status: "Active",
    balance: 600,
    joined: new Date(2023, 6, 20),
    catched: true,
  },
  {
    id: 3,
    name: "James Wilson",
    generation: "3",
    location: "London",
    firstType: "Grass",
    status: "Inactive",
    balance: 650,
    joined: new Date(2022, 11, 5),
    catched: false,
  },
  {
    id: 4,
    name: "Maria Garcia",
    generation: "4",
    location: "Madrid",
    firstType: "Electric",
    secondType: "Steel",
    status: "Active",
    balance: 0,
    joined: new Date(2023, 0, 15),
    catched: true,
  },
  {
    id: 5,
    name: "David Kim",
    generation: "5",
    location: "Seoul",
    firstType: "Psychic",
    status: "Active",
    balance: -1000,
    joined: new Date(2024, 2, 2),
    catched: false,
  },
  {
    id: 6,
    name: "Emma Hamilton",
    generation: "6",
    location: "Berlin",
    firstType: "Dragon",
    secondType: "Flying",
    status: "Inactive",
    balance: 350,
    joined: new Date(2022, 7, 17),
    catched: true,
  },
  {
    id: 7,
    name: "Lucas Brown",
    generation: "7",
    location: "Toronto",
    firstType: "Dark",
    status: "Active",
    balance: 900,
    joined: new Date(2023, 2, 11),
    catched: true,
  },
  {
    id: 8,
    name: "Olivia Lee",
    generation: "8",
    location: "Singapore",
    firstType: "Fairy",
    secondType: "Normal",
    status: "Active",
    balance: 2100,
    joined: new Date(2023, 9, 24),
    catched: true,
  },
  {
    id: 9,
    name: "Michael Johnson",
    generation: "9",
    location: "New York",
    firstType: "Fighting",
    status: "Inactive",
    balance: 0,
    joined: new Date(2021, 11, 3),
    catched: false,
  },
  {
    id: 10,
    name: "Chloe Martin",
    generation: "10",
    location: "Paris",
    firstType: "Poison",
    secondType: "Ground",
    status: "Active",
    balance: 150,
    joined: new Date(2022, 4, 19),
    catched: true,
  },
  {
    id: 11,
    name: "Henry Clark",
    generation: "11",
    location: "Los Angeles",
    firstType: "Rock",
    status: "Inactive",
    balance: -170,
    joined: new Date(2024, 1, 27),
    catched: false,
  },
  {
    id: 12,
    name: "Layla Walker",
    generation: "12",
    location: "London",
    firstType: "Bug",
    secondType: "Flying",
    status: "Active",
    balance: 870,
    joined: new Date(2023, 6, 8),
    catched: true,
  },
  {
    id: 13,
    name: "Daniel Evans",
    generation: "13",
    location: "Berlin",
    firstType: "Ghost",
    status: "Active",
    balance: 1390,
    joined: new Date(2023, 11, 14),
    catched: true,
  },
  {
    id: 14,
    name: "Sophia Patel",
    generation: "14",
    location: "Singapore",
    firstType: "Steel",
    secondType: "Psychic",
    status: "Inactive",
    balance: 220,
    joined: new Date(2022, 2, 12),
    catched: false,
  },
  {
    id: 15,
    name: "Noah Kim",
    generation: "15",
    location: "Seoul",
    firstType: "Ice",
    status: "Active",
    balance: 1580,
    joined: new Date(2023, 8, 30),
    catched: true,
  },
  {
    id: 16,
    name: "Mia Turner",
    generation: "16",
    location: "Dublin",
    firstType: "Normal",
    secondType: "Flying",
    status: "Active",
    balance: 630,
    joined: new Date(2021, 9, 5),
    catched: true,
  },
  {
    id: 17,
    name: "Liam Martinez",
    generation: "17",
    location: "Toronto",
    firstType: "Ground",
    status: "Inactive",
    balance: -90,
    joined: new Date(2022, 3, 28),
    catched: false,
  },
  {
    id: 18,
    name: "Chloe Wright",
    generation: "18",
    location: "Amsterdam",
    firstType: "Fire",
    secondType: "Fighting",
    status: "Active",
    balance: 1200,
    joined: new Date(2023, 10, 20),
    catched: true,
  },
  {
    id: 19,
    name: "Benjamin Scott",
    generation: "19",
    location: "Chicago",
    firstType: "Water",
    status: "Inactive",
    balance: 410,
    joined: new Date(2023, 7, 15),
    catched: false,
  },
  {
    id: 20,
    name: "Ava Nelson",
    generation: "20",
    location: "Sydney",
    firstType: "Grass",
    secondType: "Poison",
    status: "Active",
    balance: 960,
    joined: new Date(2022, 12, 3),
    catched: true,
  },
  {
    id: 21,
    name: "Jack Lee",
    generation: "21",
    location: "Hong Kong",
    firstType: "Electric",
    status: "Inactive",
    balance: -220,
    joined: new Date(2023, 1, 8),
    catched: false,
  },
  {
    id: 22,
    name: "Ella Harris",
    generation: "22",
    location: "Zurich",
    firstType: "Psychic",
    secondType: "Fairy",
    status: "Active",
    balance: 1540,
    joined: new Date(2024, 2, 18),
    catched: true,
  },
  {
    id: 23,
    name: "Harper Lewis",
    generation: "23",
    location: "Rome",
    firstType: "Dragon",
    status: "Active",
    balance: 710,
    joined: new Date(2022, 8, 23),
    catched: true,
  },
  {
    id: 24,
    name: "Logan Walker",
    generation: "24",
    location: "Barcelona",
    firstType: "Dark",
    secondType: "Ghost",
    status: "Inactive",
    balance: 270,
    joined: new Date(2023, 4, 12),
    catched: false,
  },
  {
    id: 25,
    name: "Grace Young",
    generation: "25",
    location: "Vienna",
    firstType: "Fairy",
    status: "Active",
    balance: 1100,
    joined: new Date(2021, 11, 29),
    catched: true,
  },
  {
    id: 26,
    name: "Fire Chen",
    generation: "26",
    location: "Shanghai",
    firstType: "Flying",
    secondType: "Fairy",
    status: "Active",
    balance: 1200,
    joined: new Date(2023, 10, 20),
    catched: true,
  },
];

export default function FlexiFilterTable() {
  const [data] = useState(defaultData);
  const searchParams = useSearch({ from: Route.id });
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;
  const navigate = useNavigate({ from: Route.id });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (
        searchParams.search &&
        !`${item.name} ${item.generation} ${item.firstType} ${item.secondType}, ${item.balance}`
          .toLowerCase()
          .includes(searchParams.search.toLowerCase())
      )
        return false;
      return true;
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
            {filteredData.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-muted/30 cursor-pointer",
                    isCatchedView && !row.catched && "opacity-50"
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
                  <TableCell className="flex items-center font-semibold text-[16px] gap-2">
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
