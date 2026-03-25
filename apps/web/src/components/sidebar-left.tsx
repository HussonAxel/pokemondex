import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import { pokemonCollectionFilters } from "@/data/data";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AudioWaveform,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Compass,
  Filter,
  Folder,
  Forward,
  GalleryVerticalEnd,
  MoreHorizontal,
  Search,
  Shield,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { Route } from "@/routes";
import { useNavigate, useSearch } from "@tanstack/react-router";

const DATA = {
  user: {
    name: "Skyleen",
    email: "skyleen@example.com",
    avatar:
      "https://chicoeevee.github.io/HOMENatDexIcons/pm1130_12_00_00_big.png",
  },
  teams: [
    {
      name: "National Dex",
      logo: GalleryVerticalEnd,
      plan: "Pokemon Explorer",
    },
    {
      name: "Shiny Tracker",
      logo: AudioWaveform,
      plan: "Collection View",
    },
    {
      name: "Battle Notes",
      logo: Command,
      plan: "Training View",
    },
  ],
  navMain: [
    {
      title: "Browse",
      url: "#",
      icon: Search,
      isActive: false,
      items: [
        {
          title: "National Dex",
          url: "#",
        },
        {
          title: "Latest Forms",
          url: "#",
        },
        {
          title: "Pinned Pokemon",
          url: "#",
        },
      ],
    },
    {
      title: "Filters",
      url: "#",
      icon: Filter,
      isActive: false,
      items: [
        {
          title: "Starters",
          url: "#",
        },
        {
          title: "Regional Birds",
          url: "#",
        },
        {
          title: "Regional Mammals",
          url: "#",
        },
        {
          title: "Regional Bugs",
          url: "#",
        },
        {
          title: "Fossils",
          url: "#",
        },
        {
          title: "Babies",
          url: "#",
        },
        {
          title: "Pikachu Clones",
          url: "#",
        },
        {
          title: "Eeveelutions",
          url: "#",
        },
        {
          title: "Regional Variants",
          url: "#",
        },
        {
          title: "New Evolutions",
          url: "#",
        },
        {
          title: "Mega Evolutions",
          url: "#",
        },
        {
          title: "Gigantamax",
          url: "#",
        },
        {
          title: "Pseudos Legends",
          url: "#",
        },
        {
          title: "Ultra Beasts",
          url: "#",
        },
        {
          title: "Paradoxes",
          url: "#",
        },
        {
          title: "Legendaries",
          url: "#",
        },
        {
          title: "Mythicals",
          url: "#",
        },
      ],
    },
    {
      title: "Collections",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Competitive Core",
          url: "#",
        },
        {
          title: "Shiny Watchlist",
          url: "#",
        },
        {
          title: "Legendary Vault",
          url: "#",
        },
        {
          title: "Mythical Archive",
          url: "#",
        },
        {
          title: "Breeding Targets",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Type Matchups",
      url: "#",
      icon: Shield,
    },
    {
      name: "Route Planner",
      url: "#",
      icon: Compass,
    },
    {
      name: "Shiny Hunt",
      url: "#",
      icon: Sparkles,
    },
  ],
};

type NavSection = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: Array<{ title: string; url: string }>;
};

const SidebarLeftContent = () => {
  const isMobile = useIsMobile();
  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });
  const activeCollection = searchParams.collection;
  const activePokemon = searchParams.activePokemon;

  const navMain = React.useMemo(() => {
    return DATA.navMain.map((section) => {
      if (section.title !== "Browse") {
        return section;
      }

      return {
        ...section,
        items: [
          {
            title: "National Dex",
            url: "#",
          },
          {
            title: activePokemon
              ? `Pinned #${activePokemon.toString().padStart(3, "0")}`
              : "Pinned Pokemon",
            url: "#",
          },
          {
            title: "Latest Forms",
            url: "#",
          },
        ],
      };
    }) as NavSection[];
  }, [activePokemon]);

  if (!activeTeam) return null;

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="border rounded-sm m-2 my-2"
    >
      <SidebarHeader>
        {/* Team Switcher */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeTeam.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">{activeTeam.plan}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Modes
                </DropdownMenuLabel>
                {DATA.teams.map((team, index) => (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <team.logo className="size-4 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add workspace
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Team Switcher */}
      </SidebarHeader>

      <SidebarContent>
        {/* Nav Main */}
        <SidebarGroup>
          <SidebarGroupLabel>Pokedex</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={
                  item.isActive ||
                  (item.title === "Filters" && Boolean(activeCollection))
                }
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.title === "Filters"
                        ? pokemonCollectionFilters.map((subItem) => {
                            const isActive =
                              activeCollection === subItem.key;

                            return (
                              <SidebarMenuSubItem key={subItem.key}>
                                <SidebarMenuSubButton asChild isActive={isActive}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate({
                                        to: ".",
                                        search: {
                                          ...searchParams,
                                          collection: isActive
                                            ? undefined
                                            : subItem.key,
                                          page: 1,
                                        },
                                      })
                                    }
                                  >
                                    <span>{subItem.title}</span>
                                  </button>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })
                        : item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* Nav Main */}

        {/* Nav Project */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarMenu>
            {DATA.projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>Open Utility</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Pin Shortcut</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Remove Shortcut</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const SidebarLeft = () => {
  return (
    <SidebarProvider
      className="contents "
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <SidebarLeftContent />
    </SidebarProvider>
  );
};
