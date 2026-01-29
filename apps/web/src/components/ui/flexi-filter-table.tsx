import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { FiltersTop } from "@/components/filters-top";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";
import { Route } from "@/routes/index";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import { MoreVertical, Sparkles } from "lucide-react";
import BadgeTypes from "@/components/ui/badge-type";
import Pokeball from "./svg/pokeball";

// Note: TableHeaderNames is no longer used in the render,
// as we are manually defining headers for width control.
import { TableHeaderNames } from "@/data/data";
import { orpc } from "@/utils/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";

const ITEMS_PER_PAGE = 30;

export default function FlexiFilterTable() {
  const { theme, toggleTheme } = useTheme();

  const fallBackImage =
    "https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af/scale-to-width/755";

  useHotkeys("arrowleft", () => {
    handlePageChange(currentPage - 1);
  });

  useHotkeys("arrowright", () => {
    handlePageChange(currentPage + 1);
  });

  const queryClient = useQueryClient();

  const prefetchPokemon = (id: number) => {
    const queryOptions = orpc.getPokemonOverview.queryOptions({
      input: { id },
    });
    const queryKey = queryOptions.queryKey;
    const queryState = queryClient.getQueryState(queryKey);

    const shouldPrefetch =
      !queryState ||
      queryState.dataUpdatedAt === null ||
      (queryState.dataUpdatedAt &&
        Date.now() - queryState.dataUpdatedAt > 5 * 60 * 1000);

    if (shouldPrefetch) {
      queryClient.prefetchQuery({
        ...queryOptions,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    }
  };

  const prefetchSpecies = (url: string) => {
    const speciesQueryOptions = orpc.getPokemonSpeciesData.queryOptions({
      input: { url },
    });
    const speciesQueryKey = speciesQueryOptions.queryKey;
    const queryState = queryClient.getQueryState(speciesQueryKey);

    const shouldPrefetch =
      !queryState ||
      queryState.dataUpdatedAt === null ||
      (queryState.dataUpdatedAt &&
        Date.now() - queryState.dataUpdatedAt > 5 * 60 * 1000);

    if (shouldPrefetch) {
      queryClient.prefetchQuery({
        ...speciesQueryOptions,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    }
  };

  const { Pokemons } = useLoaderData({ from: Route.id });
  const searchParams = useSearch({ from: Route.id });
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;
  const navigate = useNavigate({ from: Route.id });
  const currentPage = searchParams.page || 1;

  let PokemonsFiltered = Pokemons.results.filter((item) => item.isDefault);
  if (searchParams.search) {
    const searchTerms = searchParams.search
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter((term) => term.length > 0);

    PokemonsFiltered = PokemonsFiltered.filter((item) => {
      const searchable = `${`${item.id} - `}
        ${item.name} ${item.abilities
          ?.map((ability) => ability.ability.name)
          .join(", ")} ${`${item.types.join(", ")}`}`;

      return searchTerms.every((term) => searchable.includes(term));
    });
  }

  const totalPages = Math.ceil(PokemonsFiltered.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const PokemonsPaginated = PokemonsFiltered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    navigate({
      to: ".",
      search: {
        ...searchParams,
        page: page > 1 ? page : undefined,
      },
    });
  };

  return (
    <div className="bg-background overflow-hidden p-2 pl-4 h-full flex flex-col gap-2">
      <FiltersTop />
      <div className="flex-1 overflow-y-auto scrollbar-hide rounded-sm border border-border">
        <Table className="table-fixed w-full">
          <TableHeader className="sticky top-0 bg-background z-10 overflow-y-auto">
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead className="w-[180px]">Type(s)</TableHead>
              <TableHead className="w-[250px]">Abilities</TableHead>
              <TableHead className="w-[100px]">Stats</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PokemonsPaginated && PokemonsPaginated.length > 0 ? (
              PokemonsPaginated.map((pokemon) => {
                return (
                  <TableRow
                    key={pokemon.id}
                    className={cn(
                      "hover:bg-muted/30 cursor-pointer",
                      isCatchedView && "opacity-30",
                    )}
                    onMouseEnter={() => {
                      prefetchPokemon(pokemon.id);
                      prefetchSpecies(pokemon.species?.url || "");
                    }}
                    onClick={() =>
                      navigate({
                        to: ".",
                        search: {
                          ...searchParams,
                          activePokemon: pokemon.id,
                        },
                      })
                    }
                  >
                    <TableCell className="flex flex-row items-center font-semibold text-[16px] gap-4 py-[12px]">
                      <Pokeball stroke="red" className="w-4 h-4 " />

                      <img
                        src={`sprites/${isShinyView ? "shiny/" + pokemon.id + ".webp" : "base/" + pokemon.id + ".webp"}`}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src !== fallBackImage) {
                            img.src = fallBackImage;
                          }
                        }}
                        alt={`${pokemon.name} Pokémon sprite${isShinyView ? " (shiny)" : ""}`}
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className="w-16 h-16 bg-sidebar-accent rounded-sm p-2"
                      />
                      <div className="flex flex-col max-w-[150px] capitalize font-semibold text-[12px] lg:text-[15px] lg:text-left">
                        <p>{pokemon.name}</p>
                        <p className="text-[10px] lg:text-[14px] text-accent-foreground/60 font-normal items-center ">
                          #{pokemon.id.toString().padStart(3, "0")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell size="sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <BadgeTypes
                          pokemonTypes={pokemon.types}
                          onClick={(e, type) => {
                            e.stopPropagation();

                            const currentTypes =
                              searchParams.search?.split(",").filter(Boolean) ??
                              [];
                            const hasType = currentTypes.includes(type);

                            const newTypes = hasType
                              ? currentTypes.filter((t) => t !== type)
                              : [...currentTypes, type];

                            navigate({
                              to: ".",
                              search: {
                                ...searchParams,
                                search: newTypes.join(",") || undefined,
                                page: 1,
                              },
                            });
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2 flex-wrap">
                        <BadgeTypes
                          className="flex-nowrap"
                          onClick={(e, type) => {
                            e.stopPropagation();

                            const currentAbilities =
                              searchParams.search?.split(",").filter(Boolean) ??
                              [];
                            const hasAbility = currentAbilities.includes(type);

                            const newAbilities = hasAbility
                              ? currentAbilities.filter((t) => t !== type)
                              : [...currentAbilities, type];

                            navigate({
                              to: ".",
                              search: {
                                ...searchParams,
                                search: newAbilities.join(",") || undefined,
                                page: 1,
                              },
                            });
                          }}
                          pokemonTypes={
                            pokemon.abilities
                              ?.filter(
                                (ability) =>
                                  ability.ability.name &&
                                  ability.is_hidden === false,
                              )
                              .map((ability) => ability.ability.name) || []
                          }
                        />
                        <BadgeTypes
                          classNameBadge="!border-primary/60 !bg-primary/10 flex-nowrap"
                          pokemonTypes={
                            pokemon.abilities
                              ?.filter(
                                (ability) =>
                                  ability.ability.name &&
                                  ability.is_hidden === true,
                              )
                              .map((ability) => ability.ability.name) || []
                          }
                          onClick={(e, type) => {
                            e.stopPropagation();

                            const currentAbilities =
                              searchParams.search?.split(",").filter(Boolean) ??
                              [];
                            const hasAbility = currentAbilities.includes(type);

                            const newAbilities = hasAbility
                              ? currentAbilities.filter((t) => t !== type)
                              : [...currentAbilities, type];

                            navigate({
                              to: ".",
                              search: {
                                ...searchParams,
                                search: newAbilities.join(",") || undefined,
                                page: 1,
                              },
                            });
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* FIX 3: Wrapped progress in a w-full div */}
                      <div className="w-full pr-4">
                        <Progress
                          max={800}
                          value={Object.values(pokemon?.stats || {}).reduce(
                            (sum: number, stat: unknown) =>
                              sum + (stat as number),
                            0,
                          )}
                        >
                          <ProgressTrack>
                            <ProgressIndicator className="bg-sidebar-primary" />
                          </ProgressTrack>
                        </Progress>
                      </div>
                    </TableCell>
                    {/* FIX 5: Right aligned the Action menu */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
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
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-accent-foreground/60 font-normal"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full mx-auto items-center px-4 py-2 flex flex-row gap-2 justify-center border border-border rounded-sm">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                },
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        <div className="flex flex-row gap-4">
          <span className="inline-flex items-center justify-center">
            {theme === "light" ? (
              <Moon
                className="w-4 h-4 cursor-pointer transition-all duration-300 text-slate-500 hover:text-slate-700"
                onClick={toggleTheme}
              />
            ) : (
              <Sun
                className="w-4 h-4 cursor-pointer transition-all duration-300 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                onClick={toggleTheme}
              />
            )}
          </span>
          <span className="inline-flex items-center justify-center">
            <Sparkles
              className={`w-4 h-4 cursor-pointer transition-all duration-300 ${
                searchParams.shinyView
                  ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                  : "text-yellow-500/50"
              }`}
              onClick={() => {
                navigate({
                  search: {
                    ...searchParams,
                    shinyView: !searchParams.shinyView,
                  },
                });
              }}
            />
          </span>
          <span className="inline-flex items-center justify-center">
            <Pokeball
              className={`cursor-pointer transition-all duration-300 ${
                searchParams.catchedView
                  ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  : "opacity-50"
              }`}
              onClick={() => {
                navigate({
                  search: {
                    ...searchParams,
                    catchedView: !searchParams.catchedView,
                  },
                });
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
