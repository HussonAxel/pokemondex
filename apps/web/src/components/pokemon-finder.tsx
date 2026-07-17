import { Badge } from "@/components/ui/badge";
import BadgeTypes from "@/components/ui/badge-type";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileSystem,
  type FileSystemFileItem,
  type FileSystemItem,
  type FileSystemView,
} from "@/components/ui/file-system";
import {
  Filters,
  type Filter,
  type FilterFieldConfig,
} from "@/components/ui/filters";
import { Progress } from "@/components/ui/progress";
import { pokemonCollectionFilterMap, pokemonCollectionFilters } from "@/data/data";
import { queryPokemonCatalogIsomorphic } from "@/features/pokemon-catalog/isomorphic";
import { HOME_CATALOG_PAGE_SIZE, Route } from "@/routes";
import { orpc } from "@/utils/orpc";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Dna,
  Folder,
  Gauge,
  Layers3,
  Library,
  ListFilter,
  Moon,
  Ruler,
  Shapes,
  Sparkles,
  Sun,
  Weight,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

const pokemonTypes = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy",
];

function formatName(name: string) {
  return name.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PokemonFinder() {
  const { catalog } = useLoaderData({ from: Route.id });
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });
  const queryClient = useQueryClient();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchValue, setSearchValue] = React.useState(searchParams.search ?? "");

  React.useEffect(() => {
    setSearchValue(searchParams.search ?? "");
  }, [searchParams.search]);

  React.useEffect(() => {
    const nextSearch = searchValue.trim() || undefined;
    if (nextSearch === searchParams.search) return;
    const timeout = window.setTimeout(() => {
      void navigate({
        search: { ...searchParams, search: nextSearch, page: undefined },
        replace: true,
      });
    }, 220);
    return () => window.clearTimeout(timeout);
  }, [navigate, searchParams, searchValue]);

  React.useEffect(() => {
    void import("cuelume").then(({ bind }) => bind());
  }, []);

  const isShiny = Boolean(searchParams.shinyView);
  const isCaughtView = Boolean(searchParams.catchedView);
  const currentView: FileSystemView =
    searchParams.view === "grid" || !searchParams.view
      ? "icons"
      : searchParams.view;
  const isInfiniteView = currentView === "columns" || currentView === "gallery";
  const totalPages = Math.max(1, Math.ceil(catalog.total / HOME_CATALOG_PAGE_SIZE));

  const infiniteCatalogInput = React.useMemo(() => ({
    ability: searchParams.ability ?? [],
    abilityOperator: searchParams.abilityOperator,
    bstOperator: searchParams.bstOperator,
    collection: searchParams.collection,
    filterJoin: searchParams.filterJoin,
    generation: searchParams.generation,
    generationOperator: searchParams.generationOperator,
    maxBst: searchParams.maxBst,
    minBst: searchParams.minBst,
    pageSize: HOME_CATALOG_PAGE_SIZE,
    pokemonIds: searchParams.collection
      ? pokemonCollectionFilterMap[searchParams.collection]?.pokemonIds
      : undefined,
    pokemonIdsOperator: searchParams.collectionOperator,
    search: searchParams.search?.trim() || undefined,
    type: searchParams.type ?? [],
    typeOperator: searchParams.typeOperator,
  }), [searchParams]);

  const infiniteCatalog = useInfiniteQuery({
    queryKey: ["pokemon-catalog", "infinite", infiniteCatalogInput],
    queryFn: ({ pageParam }) => queryPokemonCatalogIsomorphic({
      ...infiniteCatalogInput,
      page: pageParam,
    }),
    initialPageParam: 1,
    initialData: catalog.page === 1
      ? { pages: [catalog], pageParams: [1] }
      : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page * HOME_CATALOG_PAGE_SIZE < lastPage.total
        ? lastPage.page + 1
        : undefined,
    enabled: isInfiniteView,
  });

  const visibleCatalogItems = isInfiniteView
    ? infiniteCatalog.data?.pages.flatMap((page) => page.items) ?? catalog.items
    : catalog.items;

  const items: FileSystemItem[] = visibleCatalogItems.map((pokemon) => ({
    kind: "file",
    key: String(pokemon.id),
    path: `pokemon/${pokemon.id}`,
    name: formatName(pokemon.name),
    contentType: "application/vnd.pokemondex.pokemon",
    previewImageUrl: `/sprites/${isShiny ? "shiny" : "base"}/${pokemon.id}.webp`,
    metadata: {
      number: `#${String(pokemon.id).padStart(4, "0")}`,
      types: pokemon.types.join(", "),
      abilities: [...pokemon.visibleAbilityNames, ...pokemon.hiddenAbilityNames].join(", "),
      visibleAbilities: pokemon.visibleAbilityNames.join(", "),
      hiddenAbilities: pokemon.hiddenAbilityNames.join(", "),
      bst: String(pokemon.bst),
      generation: pokemon.generation ? `Generation ${pokemon.generation}` : "Unknown",
      speciesUrl: pokemon.speciesUrl ?? "",
    },
  }));

  const updateFilters = (next: Partial<typeof searchParams>) => {
    void navigate({ search: { ...searchParams, ...next, page: undefined } });
  };

  const prefetchPokemon = (file: FileSystemFileItem) => {
    const id = Number(file.key);
    if (!Number.isFinite(id)) return;
    void queryClient.prefetchQuery({
      ...orpc.getPokemonOverview.queryOptions({ input: { id } }),
      staleTime: 5 * 60 * 1000,
    });
    const speciesUrl = file.metadata?.speciesUrl;
    if (speciesUrl) {
      void queryClient.prefetchQuery({
        ...orpc.getPokemonSpeciesData.queryOptions({ input: { url: speciesUrl } }),
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const openPokemon = (file: FileSystemFileItem) => {
    void navigate({
      to: "/pokemon/$pokemonId",
      params: { pokemonId: String(file.key) },
    });
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === catalog.page) return;
    void navigate({
      search: { ...searchParams, page: page === 1 ? undefined : page },
    });
  };

  const activeTypes = searchParams.type ?? [];
  const activeAbilities = searchParams.ability ?? [];
  const abilityOptions = [...new Set(visibleCatalogItems.flatMap((pokemon) => [
    ...pokemon.visibleAbilityNames,
    ...pokemon.hiddenAbilityNames,
  ]))].sort();

  return (
    <main className="h-full bg-muted/25 p-2 sm:p-3">
      <div className="mx-auto grid h-full max-w-[1800px] grid-cols-1 overflow-hidden rounded-md border bg-background shadow-sm md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 flex-col border-r bg-sidebar/70 md:flex">
          <div className="flex h-14 items-center gap-3 border-b px-4">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><Library className="size-4" /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Pokemon Explorer</p>
              <p className="text-[11px] text-muted-foreground">National Pokedex</p>
            </div>
          </div>
          <nav className="min-h-0 flex-1 overflow-auto px-2 py-3" aria-label="Pokemon collections">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Locations</p>
            <button
              type="button"
              className="finder-source aria-pressed:bg-primary/10 aria-pressed:text-primary"
              aria-pressed={!searchParams.collection}
              onClick={() => updateFilters({ collection: undefined, collectionOperator: undefined })}
            >
              <Library /> All Pokemon
              <span>{!searchParams.collection ? catalog.total : ""}</span>
            </button>
            <p className="mt-5 px-2 pb-1.5 text-[10px] font-semibold uppercase text-muted-foreground">Smart folders</p>
            {pokemonCollectionFilters.map((collection) => (
              <button
                key={collection.key}
                type="button"
                className="finder-source aria-pressed:bg-primary/10 aria-pressed:text-primary"
                aria-pressed={searchParams.collection === collection.key}
                onClick={() => updateFilters({ collection: collection.key, collectionOperator: undefined })}
              >
                <Folder /> <span className="min-w-0 flex-1 truncate text-left">{collection.title}</span>
              </button>
            ))}
          </nav>
          <div className="border-t p-3 text-[10px] leading-4 text-muted-foreground">
            Double-click a Pokemon to open its profile.
          </div>
        </aside>

        <FileSystem
          items={items}
          className={isCaughtView ? "[&_[data-file-index]]:opacity-35" : undefined}
          title={pokemonCollectionFilters.find((item) => item.key === searchParams.collection)?.title ?? "All Pokemon"}
          view={currentView}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onViewChange={(view) => updateFilters({ view })}
          onSelectionChange={(item) => item?.kind === "file" && prefetchPokemon(item)}
          onFileOpen={openPokemon}
          hasMore={isInfiniteView && infiniteCatalog.hasNextPage}
          isLoadingMore={infiniteCatalog.isFetchingNextPage}
          onLoadMore={() => {
            if (!infiniteCatalog.hasNextPage || infiniteCatalog.isFetchingNextPage) return;
            void infiniteCatalog.fetchNextPage();
          }}
          renderFilePreview={(file, large) => (
            <img
              src={file.previewImageUrl ?? undefined}
              alt=""
              aria-hidden="true"
              draggable={false}
              className={large ? "h-full max-h-[430px] w-full object-contain pixelated" : "h-full w-full object-contain pixelated"}
            />
          )}
          renderFileDetails={(file) => (
            <PokemonInspector
              file={file}
              onOpen={() => openPokemon(file)}
              onTypeClick={(type) => {
                const next = activeTypes.includes(type)
                  ? activeTypes.filter((item) => item !== type)
                  : [...activeTypes, type].slice(-2);
                updateFilters({ type: next.length ? next : undefined });
              }}
              onAbilityClick={(ability) => {
                const next = activeAbilities.includes(ability)
                  ? activeAbilities.filter((item) => item !== ability)
                  : [...activeAbilities, ability].slice(-3);
                updateFilters({ ability: next.length ? next : undefined });
              }}
            />
          )}
          renderListTypes={(file) => (
            <BadgeTypes
              className="flex-nowrap gap-1"
              classNameBadge="px-2 py-1 text-[9px]"
              pokemonTypes={file.metadata?.types.split(", ").filter(Boolean) ?? []}
            />
          )}
          renderListAbilities={(file) => (
            <PokemonListAbilities file={file} />
          )}
          renderListPower={(file) => (
            <PokemonListPower file={file} />
          )}
          toolbarLeading={(
            <MobileCollectionMenu
              active={searchParams.collection}
              onChange={(collection) => updateFilters({ collection, collectionOperator: undefined })}
            />
          )}
          toolbarTrailing={(
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="finder-icon-button"
                aria-label="Change theme"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              ><Moon className="dark:hidden" /><Sun className="hidden text-amber-500 dark:block" /></button>
            </div>
          )}
          filterBar={(
            <PokemonFilters
              activeAbilities={activeAbilities}
              abilityOperator={searchParams.abilityOperator}
              activeCollection={searchParams.collection}
              activeTypes={activeTypes}
              abilityOptions={abilityOptions}
              generation={searchParams.generation}
              generationOperator={searchParams.generationOperator}
              maxBst={searchParams.maxBst}
              minBst={searchParams.minBst}
              bstOperator={searchParams.bstOperator}
              collectionOperator={searchParams.collectionOperator}
              filterJoin={searchParams.filterJoin}
              status={isShiny ? "shiny" : isCaughtView ? "caught" : undefined}
              typeOperator={searchParams.typeOperator}
              onUpdate={updateFilters}
            />
          )}
          footer={isInfiniteView ? (
            <div className="flex w-full items-center justify-between gap-3">
              <span>{visibleCatalogItems.length} of {catalog.total} Pokemon loaded</span>
              <span className="font-mono text-[10px]">
                {infiniteCatalog.isFetchingNextPage ? "Loading…" : "Scroll to explore"}
              </span>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-3">
              <span>{catalog.total} Pokemon · Page {catalog.page} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <button type="button" className="finder-icon-button h-7 w-7" aria-label="Previous page" disabled={catalog.page <= 1} onClick={() => changePage(catalog.page - 1)}><ChevronLeft /></button>
                <span className="min-w-14 text-center font-mono text-[10px]">{catalog.page} / {totalPages}</span>
                <button type="button" className="finder-icon-button h-7 w-7" aria-label="Next page" disabled={catalog.page >= totalPages} onClick={() => changePage(catalog.page + 1)}><ChevronRight /></button>
              </div>
            </div>
          )}
        />
      </div>
    </main>
  );
}

function PokemonListAbilities({ file }: { file: FileSystemFileItem }) {
  const visibleAbilities = file.metadata?.visibleAbilities
    .split(", ")
    .filter(Boolean)
    .map(formatName) ?? [];
  const hiddenAbilities = file.metadata?.hiddenAbilities
    .split(", ")
    .filter(Boolean)
    .map(formatName) ?? [];

  return (
    <span className="flex min-w-0 flex-col items-start gap-1">
      <span className="w-full truncate text-xs font-medium">
        {visibleAbilities.join(" · ") || "No standard ability"}
      </span>
      {hiddenAbilities.length ? (
        <Badge className="max-w-full truncate" variant="secondary">
          Hidden: {hiddenAbilities.join(" · ")}
        </Badge>
      ) : (
        <span className="text-[10px] text-muted-foreground">
          No hidden ability
        </span>
      )}
    </span>
  );
}

function PokemonListPower({ file }: { file: FileSystemFileItem }) {
  const bst = Number(file.metadata?.bst ?? 0);
  const tier = bst >= 600
    ? "Exceptional"
    : bst >= 530
      ? "Elite"
      : bst >= 450
        ? "Strong"
        : bst >= 350
          ? "Balanced"
          : "Developing";

  return (
    <span className="flex min-w-0 flex-col gap-1.5 pr-1">
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-sm font-semibold tabular-nums">{bst}</span>
        <span className="text-[10px] text-muted-foreground">{tier}</span>
      </span>
      <Progress
        aria-hidden="true"
        value={Math.min(100, (bst / 720) * 100)}
      />
    </span>
  );
}

function PokemonInspector({ file, onOpen, onTypeClick, onAbilityClick }: {
  file: FileSystemFileItem;
  onOpen: () => void;
  onTypeClick: (type: string) => void;
  onAbilityClick: (ability: string) => void;
}) {
  const pokemonId = Number(file.key);
  const speciesUrl = file.metadata?.speciesUrl ?? "";
  const pokemonQuery = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    enabled: Number.isFinite(pokemonId),
    staleTime: 5 * 60 * 1000,
  });
  const speciesQuery = useQuery({
    ...orpc.getPokemonSpeciesData.queryOptions({ input: { url: speciesUrl } }),
    enabled: Boolean(speciesUrl),
    staleTime: 5 * 60 * 1000,
  });

  const pokemon = pokemonQuery.data;
  const species = speciesQuery.data;
  const types = file.metadata?.types.split(", ").filter(Boolean) ?? [];
  const fallbackAbilities = file.metadata?.abilities.split(", ").filter(Boolean) ?? [];
  const abilities = pokemon?.abilities.map((entry) => ({
    hidden: entry.is_hidden,
    name: entry.ability.name,
  })) ?? fallbackAbilities.map((name) => ({ hidden: false, name }));
  const stats = pokemon?.statsDetails ?? [];
  const flavorText = species?.flavor_text_entries?.find(
    (entry) => entry.language?.name === "en",
  )?.flavor_text?.replace(/\s+/g, " ").trim();
  const gender = species?.gender_rate === -1
    ? "Genderless"
    : species?.gender_rate !== undefined
      ? `${formatPercentage((1 - species.gender_rate / 8) * 100)}% ♂ · ${formatPercentage((species.gender_rate / 8) * 100)}% ♀`
      : "Unknown";

  return (
    <div className="space-y-5 pb-2">
      <section className="relative overflow-hidden rounded-lg border bg-background">
        <div className="relative grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-4 p-4">
          <div className="grid aspect-square place-items-center rounded-md border bg-muted/25 p-1.5 shadow-sm">
            <img
              src={file.previewImageUrl ?? undefined}
              alt={`${file.name} sprite`}
              className="h-full w-full object-contain pixelated drop-shadow-md"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground">{file.metadata?.number}</p>
              <span className="rounded-full border bg-background/75 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{file.metadata?.generation}</span>
            </div>
            <h2 className="mt-1 truncate text-2xl font-bold tracking-tight">{file.name}</h2>
            <BadgeTypes
              className="mt-2 gap-1.5"
              classNameBadge="px-2.5 py-1 text-[9px]"
              pokemonTypes={types}
              onClick={(event, type) => { event.stopPropagation(); onTypeClick(type); }}
            />
          </div>
        </div>
      </section>

      {flavorText ? (
        <section className="border-l-2 border-primary pl-3">
          <div className="mb-1 flex items-center gap-1.5 text-primary"><BookOpen className="size-3.5" /><p className="finder-label mb-0 text-primary">Pokedex entry</p></div>
          <p className="text-xs leading-5 text-muted-foreground">{flavorText}</p>
        </section>
      ) : null}

      <section>
        <p className="finder-label">Profile</p>
        <dl className="grid grid-cols-2 overflow-hidden rounded-md border bg-background">
          <InspectorDatum icon={Ruler} label="Height" value={pokemon?.height ? `${(pokemon.height / 10).toFixed(1)} m` : "—"} />
          <InspectorDatum icon={Weight} label="Weight" value={pokemon?.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : "—"} borderLeft />
          <InspectorDatum icon={Sparkles} label="Base experience" value={pokemon?.baseExperience?.toString() ?? "—"} borderTop />
          <InspectorDatum icon={Dna} label="Gender" value={gender} borderLeft borderTop />
        </dl>
      </section>

      <section>
        <div className="mb-2 flex items-end justify-between gap-3">
          <p className="finder-label mb-0">Base stats</p>
          <p className="font-mono text-xs font-bold tabular-nums"><span className="mr-1 text-[9px] font-medium text-muted-foreground">TOTAL</span>{file.metadata?.bst}</p>
        </div>
        <div className="space-y-2.5 rounded-md border bg-background p-3">
          {stats.length ? stats.map((stat) => (
            <div key={stat.stat.name} className="grid grid-cols-[4.75rem_2rem_minmax(0,1fr)] items-center gap-2">
              <span className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{formatStatLabel(stat.stat.name)}</span>
              <span className="text-right font-mono text-[11px] font-semibold tabular-nums">{stat.base_stat}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.min(100, stat.base_stat / 1.8)}%` }} />
              </span>
            </div>
          )) : (
            <div className="grid grid-cols-3 gap-2" aria-label="Loading base stats">
              {[0, 1, 2, 3, 4, 5].map((item) => <span key={item} className="h-5 animate-pulse rounded bg-muted" />)}
            </div>
          )}
        </div>
      </section>

      <section>
        <p className="finder-label">Abilities</p>
        <div className="grid gap-1.5">
          {abilities.map((ability) => (
            <button key={`${ability.name}-${ability.hidden}`} type="button" className="group flex items-center justify-between rounded-md border bg-background px-3 py-2 text-left transition-colors hover:border-primary/35 hover:bg-primary/5" onClick={() => onAbilityClick(ability.name)}>
              <span className="text-xs font-medium">{formatName(ability.name)}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary">{ability.hidden ? "Hidden" : "Standard"}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="finder-label">Species</p>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border bg-background p-3">
          <InspectorTextDatum label="Habitat" value={species?.habitat?.name ? formatName(species.habitat.name) : "Unknown"} />
          <InspectorTextDatum label="Growth rate" value={species?.growth_rate?.name ? formatName(species.growth_rate.name) : "Unknown"} />
          <InspectorTextDatum label="Egg groups" value={species?.egg_groups?.length ? species.egg_groups.map((group) => formatName(group.name)).join(", ") : "Unknown"} />
          <InspectorTextDatum label="Hatch cycles" value={species?.hatch_counter?.toString() ?? "Unknown"} />
          <InspectorTextDatum label="Forms" value={pokemon?.forms.length ? pokemon.forms.length.toString() : "1"} />
          <InspectorTextDatum label="Pokédex order" value={pokemon?.order?.toString() ?? "—"} />
        </dl>
      </section>

      <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none" onClick={onOpen}>
        <Activity className="size-4" /> Open full profile
      </button>
    </div>
  );
}

function InspectorDatum({ icon: Icon, label, value, borderLeft = false, borderTop = false }: {
  icon: typeof Ruler;
  label: string;
  value: string;
  borderLeft?: boolean;
  borderTop?: boolean;
}) {
  return (
    <div className={`${borderLeft ? "border-l" : ""} ${borderTop ? "border-t" : ""} flex min-w-0 items-center gap-2.5 p-3`}>
      <span className="grid size-7 shrink-0 place-items-center rounded-[4px] bg-muted text-muted-foreground"><Icon className="size-3.5" /></span>
      <div className="min-w-0"><dt className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="truncate text-xs font-semibold tabular-nums">{value}</dd></div>
    </div>
  );
}

function InspectorTextDatum({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-0.5 truncate text-xs font-semibold">{value}</dd></div>;
}

function formatStatLabel(name: string) {
  const labels: Record<string, string> = {
    attack: "Attack",
    defense: "Defense",
    hp: "HP",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return labels[name] ?? formatName(name);
}

function formatPercentage(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

type PokemonFilterValue = string | number | boolean;

type PokemonFilterUpdate = {
  ability?: string[];
  abilityOperator?: "is_any_of" | "includes_all" | "is_not_any_of";
  bstOperator?: "greater_than" | "less_than" | "between" | "not_between" | "equals" | "not_equals";
  catchedView?: boolean;
  collection?: (typeof pokemonCollectionFilters)[number]["key"];
  collectionOperator?: "is" | "is_not";
  filterJoin?: "and" | "or";
  generation?: number;
  generationOperator?: "is" | "is_not";
  maxBst?: number;
  minBst?: number;
  shinyView?: boolean;
  type?: string[];
  typeOperator?: "is_any_of" | "includes_all" | "is_not_any_of";
};

function PokemonFilters({
  activeAbilities,
  abilityOperator,
  activeCollection,
  activeTypes,
  abilityOptions,
  bstOperator,
  collectionOperator,
  filterJoin,
  generation,
  generationOperator,
  maxBst,
  minBst,
  status,
  typeOperator,
  onUpdate,
}: {
  activeAbilities: string[];
  abilityOperator?: PokemonFilterUpdate["abilityOperator"];
  activeCollection?: (typeof pokemonCollectionFilters)[number]["key"];
  activeTypes: string[];
  abilityOptions: string[];
  bstOperator?: PokemonFilterUpdate["bstOperator"];
  collectionOperator?: PokemonFilterUpdate["collectionOperator"];
  filterJoin?: PokemonFilterUpdate["filterJoin"];
  generation?: number;
  generationOperator?: PokemonFilterUpdate["generationOperator"];
  maxBst?: number;
  minBst?: number;
  status?: "shiny" | "caught";
  typeOperator?: PokemonFilterUpdate["typeOperator"];
  onUpdate: (next: PokemonFilterUpdate) => void;
}) {
  const fields = React.useMemo<FilterFieldConfig<PokemonFilterValue>[]>(() => [
    {
      key: "logic",
      label: "Conditions",
      type: "select",
      icon: <ListFilter />,
      searchable: false,
      operators: [{ value: "is", label: "match" }],
      options: [
        { value: "and", label: "All conditions (AND)" },
        { value: "or", label: "Any condition (OR)" },
      ],
    },
    {
      key: "type",
      label: "Type",
      type: "multiselect",
      icon: <Shapes />,
      maxSelections: 2,
      searchable: false,
      defaultOperator: "includes_all",
      operators: [
        { value: "is_any_of", label: "matches any (OR)" },
        { value: "includes_all", label: "matches all (AND)" },
        { value: "is_not_any_of", label: "matches none" },
      ],
      options: pokemonTypes.map((type) => ({ value: type, label: formatName(type) })),
    },
    {
      key: "ability",
      label: "Ability",
      type: "multiselect",
      icon: <Dna />,
      maxSelections: 3,
      defaultOperator: "includes_all",
      operators: [
        { value: "is_any_of", label: "matches any (OR)" },
        { value: "includes_all", label: "matches all (AND)" },
        { value: "is_not_any_of", label: "matches none" },
      ],
      options: abilityOptions.map((ability) => ({ value: ability, label: formatName(ability) })),
    },
    {
      key: "generation",
      label: "Generation",
      type: "select",
      icon: <Layers3 />,
      searchable: false,
      operators: [
        { value: "is", label: "is" },
        { value: "is_not", label: "is not" },
      ],
      options: Array.from({ length: 9 }, (_, index) => ({
        value: index + 1,
        label: `Generation ${index + 1}`,
      })),
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      icon: <Sparkles />,
      searchable: false,
      operators: [{ value: "is", label: "is" }],
      options: [
        { value: "shiny", label: "Shiny sprites" },
        { value: "caught", label: "Caught view" },
      ],
    },
    {
      key: "collection",
      label: "Collection",
      type: "select",
      icon: <Folder />,
      operators: [
        { value: "is", label: "is" },
        { value: "is_not", label: "is not" },
      ],
      options: pokemonCollectionFilters.map((collection) => ({
        value: collection.key,
        label: collection.title,
      })),
    },
    {
      key: "bst",
      label: "Base stats",
      type: "number",
      icon: <Gauge />,
      min: 0,
      max: 1200,
      step: 1,
      defaultOperator: "greater_than",
      operators: [
        { value: "greater_than", label: "is at least" },
        { value: "less_than", label: "is at most" },
        { value: "between", label: "is between" },
        { value: "not_between", label: "is not between" },
        { value: "equals", label: "equals" },
        { value: "not_equals", label: "does not equal" },
      ],
    },
  ], [abilityOptions]);

  const filters: Filter<PokemonFilterValue>[] = [];
  if (filterJoin) {
    filters.push({ id: "logic", field: "logic", operator: "is", values: [filterJoin] });
  }
  if (activeTypes.length) {
    filters.push({ id: "type", field: "type", operator: typeOperator ?? "includes_all", values: activeTypes });
  }
  if (activeAbilities.length) {
    filters.push({ id: "ability", field: "ability", operator: abilityOperator ?? "includes_all", values: activeAbilities });
  }
  if (generation) {
    filters.push({ id: "generation", field: "generation", operator: generationOperator ?? "is", values: [generation] });
  }
  if (status) {
    filters.push({ id: "status", field: "status", operator: "is", values: [status] });
  }
  if (activeCollection) {
    filters.push({ id: "collection", field: "collection", operator: collectionOperator ?? "is", values: [activeCollection] });
  }
  if (minBst !== undefined || maxBst !== undefined) {
    const resolvedBstOperator = bstOperator ??
      (minBst !== undefined && maxBst !== undefined ? "between" : maxBst !== undefined ? "less_than" : "greater_than");
    const bstValues = resolvedBstOperator === "between" || resolvedBstOperator === "not_between"
      ? [String(minBst ?? 0), maxBst === undefined ? "" : String(maxBst)]
      : [String(resolvedBstOperator === "less_than" ? maxBst ?? minBst ?? 0 : minBst ?? maxBst ?? 0)];
    filters.push({ id: "bst", field: "bst", operator: resolvedBstOperator, values: bstValues });
  }

  const readNumber = (value: PokemonFilterValue | undefined) => {
    if (value === "" || value === undefined) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? Math.min(1200, Math.max(0, Math.round(parsed)))
      : undefined;
  };

  const handleChange = (nextFilters: Filter<PokemonFilterValue>[]) => {
    const find = (field: string) => nextFilters.find((filter) => filter.field === field);
    const logicFilter = find("logic");
    const typeFilter = find("type");
    const abilityFilter = find("ability");
    const generationFilter = find("generation");
    const statusFilter = find("status");
    const collectionFilter = find("collection");
    const bstFilter = find("bst");
    const bstFirst = readNumber(bstFilter?.values[0]);
    const bstSecond = readNumber(bstFilter?.values[1]);
    const nextTypes = typeFilter?.values.map(String).slice(0, 2) ?? [];
    const nextAbilities = abilityFilter?.values.map(String).slice(0, 3) ?? [];

    onUpdate({
      type: nextTypes.length ? nextTypes : undefined,
      typeOperator: typeFilter?.operator as PokemonFilterUpdate["typeOperator"],
      ability: nextAbilities.length ? nextAbilities : undefined,
      abilityOperator: abilityFilter?.operator as PokemonFilterUpdate["abilityOperator"],
      filterJoin: logicFilter?.values[0] as PokemonFilterUpdate["filterJoin"],
      generation: readNumber(generationFilter?.values[0]),
      generationOperator: generationFilter?.operator as PokemonFilterUpdate["generationOperator"],
      collection: collectionFilter?.values[0] as PokemonFilterUpdate["collection"],
      collectionOperator: collectionFilter?.operator as PokemonFilterUpdate["collectionOperator"],
      shinyView: statusFilter?.values[0] === "shiny" || undefined,
      catchedView: statusFilter?.values[0] === "caught" || undefined,
      bstOperator: bstFilter?.operator as PokemonFilterUpdate["bstOperator"],
      minBst: bstFilter?.operator === "less_than" ? undefined : (bstFirst ?? (bstFilter ? 0 : undefined)),
      maxBst: bstFilter?.operator === "between" || bstFilter?.operator === "not_between"
        ? bstSecond
        : bstFilter?.operator === "less_than" ? bstFirst : undefined,
    });
  };

  return (
    <div data-slot="pokemon-filters" className="shrink-0 border-b bg-muted/10 px-3 py-2">
      <Filters
        filters={filters}
        fields={fields}
        onChange={handleChange}
        size="sm"
        variant="outline"
        radius="md"
        addButtonText="Filter"
        showSearchInput={false}
        allowMultiple={false}
      />
    </div>
  );
}

function MobileCollectionMenu({ active, onChange }: {
  active?: (typeof pokemonCollectionFilters)[number]["key"];
  onChange: (value: (typeof pokemonCollectionFilters)[number]["key"] | undefined) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><button type="button" className="finder-icon-button md:hidden" aria-label="Choose collection"><Folder /></button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 overflow-auto">
        <DropdownMenuCheckboxItem checked={!active} onCheckedChange={() => onChange(undefined)}>All Pokemon</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {pokemonCollectionFilters.map((collection) => <DropdownMenuCheckboxItem key={collection.key} checked={active === collection.key} onCheckedChange={() => onChange(collection.key)}>{collection.title}</DropdownMenuCheckboxItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
