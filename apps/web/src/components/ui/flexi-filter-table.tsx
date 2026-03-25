import { useEffect, useRef } from "react";

import { FiltersTop } from "@/components/filters-top";
import BadgeTypes from "@/components/ui/badge-type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pokemonCollectionFilterMap } from "@/data/data";
import { cn } from "@/lib/utils";
import {
  HOME_CATALOG_PAGE_SIZE,
  Route,
  getHomeCatalogInput,
  getHomeLoaderDeps,
} from "@/routes";
import { orpc } from "@/utils/orpc";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import { Moon, MoreVertical, Sparkles, Sun } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import Pokeball from "./svg/pokeball";

export default function FlexiFilterTable() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate({ from: Route.id });
  const searchParams = useSearch({ from: Route.id });
  const { catalog } = useLoaderData({ from: Route.id });
  const queryClient = useQueryClient();
  const preloadedImageUrlsRef = useRef(new Set<string>());

  const currentPage = catalog.page;
  const activePokemon = searchParams.activePokemon;
  const searchTypes = searchParams.type ?? [];
  const searchAbilities = searchParams.ability ?? [];
  const isShinyView = searchParams.shinyView;
  const isCatchedView = searchParams.catchedView;
  const activeCollection = searchParams.collection
    ? pokemonCollectionFilterMap[searchParams.collection]
    : undefined;

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

  const totalPages = Math.max(1, Math.ceil(catalog.total / HOME_CATALOG_PAGE_SIZE));
  const PokemonsPaginated = catalog.items;

  const preloadSprite = (src: string) => {
    if (typeof window === "undefined") {
      return;
    }

    if (preloadedImageUrlsRef.current.has(src)) {
      return;
    }

    preloadedImageUrlsRef.current.add(src);

    const image = new window.Image();
    image.src = src;
  };

  const preloadSpritesForItems = (
    items: Array<{
      id: number;
    }>,
  ) => {
    for (const item of items) {
      preloadSprite(`/sprites/base/${item.id}.webp`);
      preloadSprite(`/sprites/shiny/${item.id}.webp`);
    }
  };

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

  useEffect(() => {
    preloadSpritesForItems(PokemonsPaginated);

    const adjacentPages = [currentPage - 1, currentPage + 1].filter(
      (page) => page >= 1 && page <= totalPages,
    );

    for (const page of adjacentPages) {
      const deps = getHomeLoaderDeps({
        search: {
          ...searchParams,
          page,
        },
      });

      void queryClient
        .ensureQueryData(
          orpc.getPokemonsCatalog.queryOptions({
            input: getHomeCatalogInput(deps),
          }),
        )
        .then((nextCatalog) => {
          preloadSpritesForItems(nextCatalog.items);
        });
    }
  }, [PokemonsPaginated, currentPage, queryClient, searchParams, totalPages]);

  return (
    <div className="bg-background h-full flex flex-col gap-2 p-2 pl-4">
      <FiltersTop />

      {/* TABLE */}
      <div className="flex-1 overflow-auto rounded-sm border border-border bg-background scroll-smooth overscroll-x-contain">
        <div className="min-w-[900px]">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-muted/35 backdrop-blur supports-[backdrop-filter]:bg-background/95">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[240px] text-foreground/80">Name</TableHead>
                <TableHead className="min-w-[180px] text-foreground/80">Type(s)</TableHead>
                <TableHead className="min-w-[260px] text-foreground/80">Abilities</TableHead>
                <TableHead className="min-w-[160px] text-foreground/80">Stats</TableHead>
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
                      "group cursor-pointer border-l-2 border-l-transparent transition-colors",
                      "hover:bg-muted/25",
                      activePokemon === pokemon.id &&
                        "border-l-primary bg-primary/[0.045] shadow-[inset_0_1px_0_rgba(0,0,0,0.03)]",
                      isCatchedView && "opacity-30",
                    )}
                    onMouseEnter={() => {
                      prefetchPokemon(pokemon.id);
                      prefetchSpecies(pokemon.speciesUrl ?? undefined);
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
                        <Pokeball
                          className={cn(
                            "h-4 w-4 transition-opacity",
                            activePokemon === pokemon.id
                              ? "text-primary"
                              : "opacity-65 group-hover:opacity-100",
                          )}
                          stroke="currentColor"
                        />
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
                          <p className="truncate capitalize font-semibold">
                            {pokemon.name.replace("-", " ")}
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
                          pokemonTypes={pokemon.visibleAbilityNames}
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
                          pokemonTypes={pokemon.hiddenAbilityNames}
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
                      {(() => {
                        const bst = pokemon.bst;

                        return (
                          <div className="flex min-w-[180px] items-center gap-3">
                            <span className="w-9 text-xs font-semibold text-foreground/80">
                              {bst}
                            </span>
                            <Progress className="h-2.5 flex-1" max={800} value={bst}>
                              <ProgressTrack>
                                <ProgressIndicator className="bg-sidebar-primary" />
                              </ProgressTrack>
                            </Progress>
                          </div>
                        );
                      })()}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell
                      className="min-w-[80px] text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-70 transition-opacity group-hover:opacity-100"
                          >
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
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border border-border rounded-sm px-4 py-2">
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
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
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
