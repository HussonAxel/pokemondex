import { useMemo } from "react";
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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { MoreVertical } from "lucide-react";
import { useSearch, useNavigate, useLoaderData } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import { cn } from "@/lib/utils";
import BadgeTypes from "./badge-type";
import Pokeball from "./svg/pokeball";

import { useHotkeys } from "react-hotkeys-hook";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

const ITEMS_PER_PAGE = 30;

export default function FlexiFilterTable() {
  useHotkeys("arrowleft", () => {
    handlePageChange(currentPage - 1);
  });

  useHotkeys("arrowright", () => {
    handlePageChange(currentPage + 1);
  });

  const queryClient = useQueryClient();

  const prefetchPokemon = (name: string) => {
    queryClient.prefetchQuery(orpc.getPokemonOverview.queryOptions({ input: { name } }));
  };

  const { Pokemons } = useLoaderData({ from: Route.id });
  const searchParams = useSearch({ from: Route.id });
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;
  const navigate = useNavigate({ from: Route.id });
  const currentPage = searchParams.page || 1;

  const PokemonsFiltered = useMemo(() => {
    if (!searchParams.search) {
      return Pokemons.results;
    }

    const searchTerms = searchParams.search
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter((term) => term.length > 0);

    console.log(searchTerms);

    return Pokemons.results.filter((item) => {
      const searchable = `${`${item.id} - `}
        ${item.name} ${item.abilities
        ?.map((ability) => ability.ability.name)
        .join(", ")} ${`${item.types.join(", ")}`}`;

      return searchTerms.every((term) => searchable.includes(term));
    });
  }, [Pokemons.results, searchParams.search]);

  const totalPages = Math.ceil(PokemonsFiltered.length / ITEMS_PER_PAGE);

  const PokemonsPaginated = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return PokemonsFiltered.slice(startIndex, endIndex);
  }, [PokemonsFiltered, currentPage]);

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
    <div className="bg-background overflow-hidden p-4 h-full flex flex-col">
      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-hide rounded-xl border border-border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 overflow-y-auto">
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>TYPE(S)</TableHead>
              <TableHead>ABILITIES</TableHead>
              <TableHead>STATS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
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
                      isCatchedView && "opacity-30"
                    )}
                    onMouseEnter={
                      () => {
                        prefetchPokemon(pokemon.name);
                      }}
                    onClick={() =>
                      navigate({
                        to: ".",
                        search: {
                          ...searchParams,
                          activePokemon: pokemon.name,
                        },
                      })
                    }
                  >
                    <TableCell className="flex items-center font-semibold text-[16px] gap-4">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          isShinyView ? "shiny/" + pokemon.id : pokemon.id
                        }.png`}
                        alt=""
                        className="w-16 h-16 bg-sidebar-border rounded-sm p-1"
                      />
                      <div className="flex flex-col max-w-[150px] capitalize font-semibold">
                        {pokemon.name.charAt(0).toUpperCase() +
                          pokemon.name.slice(1)}
                        <p className="text-[13px] text-accent-foreground/60 font-normal">
                          #{pokemon.id.toString().padStart(4, "0")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                      <div className="flex flex-col gap-2 max-w-32 min-w-32">
                        <BadgeTypes
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
                          className="flex flex-col"
                          classNameBadge="w-full text-center border-accent items-center justify-center flex flex-row font-bold text-white"
                          pokemonTypes={
                            pokemon.abilities
                              ?.filter(
                                (ability) =>
                                  ability.ability.name &&
                                  ability.is_hidden === false
                              )
                              .map((ability) => ability.ability.name) || []
                          }
                        />
                        <BadgeTypes
                          className="flex flex-col"
                          classNameBadge="!border-primary/60 !bg-primary/10 w-full text-center border-accent items-center justify-center font-bold text-white"
                          pokemonTypes={
                            pokemon.abilities
                              ?.filter(
                                (ability) =>
                                  ability.ability.name &&
                                  ability.is_hidden === true
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
                      <Progress
                        max={800}
                        value={Object.values(pokemon?.stats || {}).reduce(
                          (sum: number, stat: unknown) =>
                            sum + (stat as number),
                          0
                        )}
                      >
                        <ProgressTrack>
                          <ProgressIndicator className="bg-sidebar-primary" />
                        </ProgressTrack>
                      </Progress>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Pokeball stroke="red" />
                    </TableCell>
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
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
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
                    currentPage === 1 && "pointer-events-none opacity-50"
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
                }
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
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
