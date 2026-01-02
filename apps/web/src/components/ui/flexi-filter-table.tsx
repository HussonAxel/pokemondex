import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";
const defaultData = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex.t@company.com",
    location: "San Francisco",
    status: "Active",
    balance: 1250,
    joined: new Date(2023, 3, 10),
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.c@company.com",
    location: "Singapore",
    status: "Active",
    balance: 600,
    joined: new Date(2023, 6, 20),
  },
  {
    id: 3,
    name: "James Wilson",
    email: "j.wilson@company.com",
    location: "London",
    status: "Inactive",
    balance: 650,
    joined: new Date(2022, 11, 5),
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "m.garcia@company.com",
    location: "Madrid",
    status: "Active",
    balance: 0,
    joined: new Date(2023, 0, 15),
  },
  {
    id: 5,
    name: "David Kim",
    email: "d.kim@company.com",
    location: "Seoul",
    status: "Active",
    balance: -1000,
    joined: new Date(2024, 2, 2),
  },
  {
    id: 6,
    name: "Emma Hamilton",
    email: "emma.h@company.com",
    location: "Berlin",
    status: "Inactive",
    balance: 350,
    joined: new Date(2022, 7, 17),
  },
  {
    id: 7,
    name: "Lucas Brown",
    email: "lucas.brown@company.com",
    location: "Toronto",
    status: "Active",
    balance: 900,
    joined: new Date(2023, 2, 11),
  },
  {
    id: 8,
    name: "Olivia Lee",
    email: "olivia.lee@company.com",
    location: "Singapore",
    status: "Active",
    balance: 2100,
    joined: new Date(2023, 9, 24),
  },
  {
    id: 9,
    name: "Michael Johnson",
    email: "m.johnson@company.com",
    location: "New York",
    status: "Inactive",
    balance: 0,
    joined: new Date(2021, 11, 3),
  },
  {
    id: 10,
    name: "Chloe Martin",
    email: "chloe.martin@company.com",
    location: "Paris",
    status: "Active",
    balance: 150,
    joined: new Date(2022, 4, 19),
  },
  {
    id: 11,
    name: "Henry Clark",
    email: "henry.clark@company.com",
    location: "Los Angeles",
    status: "Inactive",
    balance: -170,
    joined: new Date(2024, 1, 27),
  },
  {
    id: 12,
    name: "Layla Walker",
    email: "layla.w@company.com",
    location: "London",
    status: "Active",
    balance: 870,
    joined: new Date(2023, 6, 8),
  },
  {
    id: 13,
    name: "Daniel Evans",
    email: "daniel.evans@company.com",
    location: "Berlin",
    status: "Active",
    balance: 1390,
    joined: new Date(2023, 11, 14),
  },
  {
    id: 14,
    name: "Sophia Patel",
    email: "sophia.p@company.com",
    location: "Singapore",
    status: "Inactive",
    balance: 220,
    joined: new Date(2022, 2, 12),
  },
  {
    id: 15,
    name: "Noah Kim",
    email: "noah.kim@company.com",
    location: "Seoul",
    status: "Active",
    balance: 1580,
    joined: new Date(2023, 8, 30),
  },
  {
    id: 16,
    name: "Mia Turner",
    email: "mia.turner@company.com",
    location: "Dublin",
    status: "Active",
    balance: 630,
    joined: new Date(2021, 9, 5),
  },
  {
    id: 17,
    name: "Liam Martinez",
    email: "liam.martinez@company.com",
    location: "Toronto",
    status: "Inactive",
    balance: -90,
    joined: new Date(2022, 3, 28),
  },
  {
    id: 18,
    name: "Chloe Wright",
    email: "chloe.wright@company.com",
    location: "Amsterdam",
    status: "Active",
    balance: 1200,
    joined: new Date(2023, 10, 20),
  },
  {
    id: 19,
    name: "Benjamin Scott",
    email: "benjamin.scott@company.com",
    location: "Chicago",
    status: "Inactive",
    balance: 410,
    joined: new Date(2023, 7, 15),
  },
  {
    id: 20,
    name: "Ava Nelson",
    email: "ava.nelson@company.com",
    location: "Sydney",
    status: "Active",
    balance: 960,
    joined: new Date(2022, 12, 3),
  },
  {
    id: 21,
    name: "Jack Lee",
    email: "jack.lee@company.com",
    location: "Hong Kong",
    status: "Inactive",
    balance: -220,
    joined: new Date(2023, 1, 8),
  },
  {
    id: 22,
    name: "Ella Harris",
    email: "ella.harris@company.com",
    location: "Zurich",
    status: "Active",
    balance: 1540,
    joined: new Date(2024, 2, 18),
  },
  {
    id: 23,
    name: "Harper Lewis",
    email: "harper.lewis@company.com",
    location: "Rome",
    status: "Active",
    balance: 710,
    joined: new Date(2022, 8, 23),
  },
  {
    id: 24,
    name: "Logan Walker",
    email: "logan.walker@company.com",
    location: "Barcelona",
    status: "Inactive",
    balance: 270,
    joined: new Date(2023, 4, 12),
  },
  {
    id: 25,
    name: "Grace Young",
    email: "grace.young@company.com",
    location: "Vienna",
    status: "Active",
    balance: 1100,
    joined: new Date(2021, 11, 29),
  },
];

export default function FlexiFilterTable() {
  const [data] = useState(defaultData);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const searchParams = useSearch({ from: Route.id });
  // Filters
  const [status, setStatus] = useState("All");
  const [location, setLocation] = useState("Location");
  const [minBalance, setMinBalance] = useState("");
  const [maxBalance, setMaxBalance] = useState("");
  const [joinedAfter, setJoinedAfter] = useState<Date | undefined>();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (status !== "All" && item.status !== status) return false;
      if (location !== "Location" && item.location !== location) return false;
      if (
        searchParams.search &&
        !`${item.name} ${item.email}`
          .toLowerCase()
          .includes(searchParams.search.toLowerCase())
      )
        return false;
      if (minBalance && item.balance < Number(minBalance)) return false;
      if (maxBalance && item.balance > Number(maxBalance)) return false;
      if (joinedAfter && item.joined < joinedAfter) return false;
      return true;
    });
  }, [
    data,
    searchParams.search,
    status,
    location,
    minBalance,
    maxBalance,
    joinedAfter,
  ]);

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="bg-background overflow-hidden">
      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-hide max-h-[calc(100vh-128px)]">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 overflow-y-auto">
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedRows.size === data.length}
                  onCheckedChange={(checked) =>
                    setSelectedRows(
                      checked ? new Set(data.map((d) => d.id)) : new Set()
                    )
                  }
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={() => toggleRow(row.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.status === "Active" ? "secondary" : "destructive"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>${row.balance.toLocaleString()}</TableCell>
                <TableCell>{row.joined.toDateString()}</TableCell>
                <TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
