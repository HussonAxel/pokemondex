import { Moon, Sun, MoreVertical, Sparkles } from "lucide-react";
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
import { Route } from "@/routes";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import BadgeTypes from "@/components/ui/badge-type";
import Pokeball from "./svg/pokeball";
import { orpc } from "@/utils/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";

const ITEMS_PER_PAGE = 30;

export default function FlexiFilterTable() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate({ from: Route.id });
  const searchParams = useSearch({ from: Route.id });
  const { Pokemons } = useLoaderData({ from: Route.id });
  const queryClient = useQueryClient();

  const currentPage = searchParams.page || 1;
  const searchTypes = searchParams.type ?? [];
  const searchAbilities = searchParams.ability ?? [];
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;

  const fallBackImage =
    "https://static.wikia.nocookie.net/bec6f033-936d-48c5-9c1e-7fb7207e28af/scale-to-width/755";

  useHotkeys("arrowleft", () => handlePageChange(currentPage - 1));
  useHotkeys("arrowright", () => handlePageChange(currentPage + 1));

  const prefetchPokemon = (id: number) => {
    const queryOptions = orpc.getPokemonOverview.queryOptions({
      input: { id },
    });
    const state = queryClient.getQueryState(queryOptions.queryKey);

    if (!state || Date.now() - (state.dataUpdatedAt ?? 0) > 300000) {
      queryClient.prefetchQuery({
        ...queryOptions,
        staleTime: 300000,
        gcTime: 600000,
      });
    }
  };

  const prefetchSpecies = (url?: string) => {
    if (!url) return;

    const queryOptions = orpc.getPokemonSpeciesData.queryOptions({
      input: { url },
    });
    const state = queryClient.getQueryState(queryOptions.queryKey);

    if (!state || Date.now() - (state.dataUpdatedAt ?? 0) > 300000) {
      queryClient.prefetchQuery({
        ...queryOptions,
        staleTime: 300000,
        gcTime: 600000,
      });
    }
  };

  let PokemonsFiltered = Pokemons.results.filter((p) => p.isDefault);

  if (searchParams.search) {
    const terms = searchParams.search
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    PokemonsFiltered = PokemonsFiltered.filter((p) =>
      terms.every((term) =>
        `${p.id} ${p.name} ${p.types.join(" ")} ${p.abilities
          ?.map((a) => a.ability.name)
          .join(" ")}`.includes(term),
      ),
    );
  }

  if (searchTypes.length) {
    PokemonsFiltered = PokemonsFiltered.filter((p) =>
      searchTypes.every((t) => p.types.includes(t)),
    );
  }

  if (searchAbilities.length) {
    PokemonsFiltered = PokemonsFiltered.filter((p) =>
      searchAbilities.every((a) =>
        p.abilities?.some((ab) => ab.ability.name === a),
      ),
    );
  }

  const totalPages = Math.ceil(PokemonsFiltered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const PokemonsPaginated = PokemonsFiltered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    navigate({
      to: ".",
      search: {
        ...searchParams,
        page: page > 1 ? page : undefined,
      },
    });
  }

  return (
    <div className="bg-background h-full flex flex-col gap-2 p-2 pl-4">
      <FiltersTop />

      {/* TABLE */}
      <div className="flex-1 overflow-auto rounded-sm border border-border scroll-smooth overscroll-x-contain">
        <div className="min-w-[900px]">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="min-w-[240px]">Name</TableHead>
                <TableHead className="min-w-[180px]">Type(s)</TableHead>
                <TableHead className="min-w-[260px]">Abilities</TableHead>
                <TableHead className="min-w-[160px]">Stats</TableHead>
                <TableHead className="min-w-[80px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {PokemonsPaginated.length ? (
                PokemonsPaginated.map((pokemon) => (
                  <TableRow
                    key={pokemon.id}
                    className={cn(
                      "hover:bg-muted/30 cursor-pointer",
                      isCatchedView && "opacity-30",
                    )}
                    onMouseEnter={() => {
                      prefetchPokemon(pokemon.id);
                      prefetchSpecies(pokemon.species?.url);
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
                    {/* NAME */}
                    <TableCell className="min-w-[240px]">
                      <div className="flex items-center gap-3">
                        <Pokeball className="w-4 h-4" stroke="red" />
                        <img
                          src={`sprites/${
                            isShinyView
                              ? `shiny/${pokemon.id}.webp`
                              : `base/${pokemon.id}.webp`
                          }`}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.src !== fallBackImage)
                              img.src = fallBackImage;
                          }}
                          alt={pokemon.name}
                          loading="lazy"
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-sm bg-sidebar-accent p-1 sm:p-2"
                        />
                        <div className="truncate">
                          <p className="capitalize font-semibold truncate">
                            {pokemon.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            #{pokemon.id.toString().padStart(3, "0")}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* TYPES */}
                    <TableCell className="min-w-[180px]">
                      <BadgeTypes
                        pokemonTypes={pokemon.types}
                        onClick={(e, type) => {
                          e.stopPropagation();

                          const has = searchTypes.includes(type);
                          const next = has
                            ? searchTypes.filter((t) => t !== type)
                            : [...searchTypes, type];

                          navigate({
                            to: ".",
                            search: {
                              ...searchParams,
                              type: next.length ? next : undefined,
                              page: 1,
                            },
                          });
                        }}
                      />
                    </TableCell>

                    {/* ABILITIES */}
                    <TableCell className="min-w-[260px]">
                      <div className="flex flex-wrap gap-2">
                        <BadgeTypes
                          className="flex-nowrap"
                          pokemonTypes={
                            pokemon.abilities
                              ?.filter((a) => !a.is_hidden)
                              .map((a) => a.ability.name) || []
                          }
                          onClick={(e, ability) => {
                            e.stopPropagation();

                            const has = searchAbilities.includes(ability);
                            const next = has
                              ? searchAbilities.filter((a) => a !== ability)
                              : [...searchAbilities, ability];

                            navigate({
                              to: ".",
                              search: {
                                ...searchParams,
                                ability: next.length ? next : undefined,
                                page: 1,
                              },
                            });
                          }}
                        />

                        <BadgeTypes
                          classNameBadge="!border-primary/60 !bg-primary/10 flex-nowrap"
                          pokemonTypes={
                            pokemon.abilities
                              ?.filter((a) => a.is_hidden)
                              .map((a) => a.ability.name) || []
                          }
                          onClick={(e, ability) => {
                            e.stopPropagation();

                            const has = searchAbilities.includes(ability);
                            const next = has
                              ? searchAbilities.filter((a) => a !== ability)
                              : [...searchAbilities, ability];

                            navigate({
                              to: ".",
                              search: {
                                ...searchParams,
                                ability: next.length ? next : undefined,
                                page: 1,
                              },
                            });
                          }}
                        />
                      </div>
                    </TableCell>

                    {/* STATS */}
                    <TableCell className="min-w-[160px]">
                      <Progress
                        className="h-2"
                        max={800}
                        value={Object.values(pokemon.stats || {}).reduce(
                          (sum, stat) => sum + (stat as number),
                          0,
                        )}
                      >
                        <ProgressTrack>
                          <ProgressIndicator className="bg-sidebar-primary" />
                        </ProgressTrack>
                      </Progress>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell
                      className="min-w-[80px] text-right"
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border border-border rounded-sm px-4 py-2">
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
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 2 ? (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <div className="flex gap-4">
          {theme === "light" ? (
            <Moon className="w-4 h-4 cursor-pointer" onClick={toggleTheme} />
          ) : (
            <Sun
              className="w-4 h-4 cursor-pointer text-yellow-500"
              onClick={toggleTheme}
            />
          )}

          <Sparkles
            className={cn(
              "w-4 h-4 cursor-pointer",
              isShinyView ? "text-yellow-500" : "text-yellow-500/50",
            )}
            onClick={() =>
              navigate({
                search: {
                  ...searchParams,
                  shinyView: !isShinyView,
                },
              })
            }
          />

          <Pokeball
            className={cn(
              "cursor-pointer",
              isCatchedView ? "text-red-500" : "opacity-50",
            )}
            onClick={() =>
              navigate({
                search: {
                  ...searchParams,
                  catchedView: !isCatchedView,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
