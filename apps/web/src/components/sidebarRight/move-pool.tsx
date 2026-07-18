import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { FilterTag } from "@/components/ui/filter-tag";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPokemonTypeStyle,
  pokemonTypeSurfaceClassName,
} from "@/lib/pokemon-type-styles";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { usePokemonDetailId } from "./pokemon-detail-context";

import { formatPokemonText } from "./utils";

type MoveDetail = {
  level: number;
  method: string;
  version: string;
};

type MoveRow = {
  details: MoveDetail[];
  name: string;
  rawName: string;
};

type MoveMetadata = {
  accuracy: number | null;
  category: string;
  effect: string | null;
  generation: string;
  id: number;
  name: string;
  power: number | null;
  pp: number | null;
  priority: number;
  type: string;
};

type DisplayMoveRow = {
  level: number | null;
  methods: string[];
  metadata: MoveMetadata | null;
  name: string;
  versions: string[];
};

type SelectProps = {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
};

function FilterSelect({ label, onChange, options, value }: SelectProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <select
        className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-[13px] text-foreground shadow-sm shadow-black/5 transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function uniqueLabels(values: string[]) {
  return Array.from(new Set(values));
}

function formatGeneration(value: string) {
  const numeral = value.match(/^generation-(i+)$/i)?.[1];
  return numeral ? `Generation ${numeral.toUpperCase()}` : formatPokemonText(value);
}

function sortMoves(moves: DisplayMoveRow[], sortBy: string) {
  const nextMoves = [...moves];

  nextMoves.sort((left, right) => {
    const leftLevel = left.level ?? Number.POSITIVE_INFINITY;
    const rightLevel = right.level ?? Number.POSITIVE_INFINITY;
    const byName = left.name.localeCompare(right.name);
    const byMethods = left.methods.length - right.methods.length;

    switch (sortBy) {
      case "name-asc":
        return byName;
      case "name-desc":
        return right.name.localeCompare(left.name);
      case "level-desc":
        return rightLevel - leftLevel || byName;
      case "methods-desc":
        return right.methods.length - left.methods.length || byName;
      case "methods-asc":
        return byMethods || byName;
      case "level-asc":
      default:
        return leftLevel - rightLevel || byName;
    }
  });

  return nextMoves;
}

export default function MovePoolComponent() {
  const pokemonId = usePokemonDetailId();

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [versionFilter, setVersionFilter] = useState("all");
  const [acquisitionFilter, setAcquisitionFilter] = useState("all");
  const sortBy = "level-asc";
  const deferredSearch = useDeferredValue(search);

  const movePoolQuery = useQuery({
    ...orpc.getPokemonMovePoolData.queryOptions({ input: { id: pokemonId } }),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const metadataByName = new Map(
    (movePoolQuery.data?.metadata ?? []).map((move) => [move.name, move]),
  );

  const allMoves = (movePoolQuery.data?.moves ?? []).map<MoveRow>((entry) => ({
    details: (entry.version_group_details ?? []).map((detail) => ({
      level: detail.level_learned_at,
      method: formatPokemonText(detail.move_learn_method.name),
      version: formatPokemonText(detail.version_group.name),
    })),
    name: formatPokemonText(entry.move.name),
    rawName: entry.move.name,
  }));

  const allMethods = uniqueLabels(
    allMoves.flatMap((move) => move.details.map((detail) => detail.method)),
  ).sort((left, right) => left.localeCompare(right));
  const allVersions = uniqueLabels(
    allMoves.flatMap((move) => move.details.map((detail) => detail.version)),
  ).sort((left, right) => left.localeCompare(right));

  useEffect(() => {
    if (
      methodFilter !== "all" &&
      !allMethods.some((method) => method === methodFilter)
    ) {
      setMethodFilter("all");
    }
  }, [allMethods, methodFilter]);

  useEffect(() => {
    if (
      versionFilter !== "all" &&
      !allVersions.some((version) => version === versionFilter)
    ) {
      setVersionFilter("all");
    }
  }, [allVersions, versionFilter]);

  if (!movePoolQuery.data) {
    return null;
  }

  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredMoves = sortMoves(
    allMoves
      .map<DisplayMoveRow | null>((move) => {
        const detailsForVersion =
          versionFilter === "all"
            ? move.details
            : move.details.filter((detail) => detail.version === versionFilter);

        if (detailsForVersion.length === 0) {
          return null;
        }

        const detailsForMethod =
          methodFilter === "all"
            ? detailsForVersion
            : detailsForVersion.filter((detail) => detail.method === methodFilter);

        if (detailsForMethod.length === 0) {
          return null;
        }

        const methods = uniqueLabels(
          detailsForMethod.map((detail) => detail.method),
        );
        const versions = uniqueLabels(
          detailsForMethod.map((detail) => detail.version),
        );
        const levelValues = detailsForMethod
          .filter((detail) => detail.method === "Level Up" && detail.level > 0)
          .map((detail) => detail.level);
        const level = levelValues.length > 0 ? Math.min(...levelValues) : null;

        if (acquisitionFilter === "level-up" && level === null) {
          return null;
        }

        if (acquisitionFilter === "non-level-up" && level !== null) {
          return null;
        }

        if (normalizedSearch) {
          const metadata = metadataByName.get(move.rawName);
          const haystack = [
            move.name,
            metadata?.type,
            metadata?.category,
            metadata?.effect,
          ]
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(normalizedSearch)) {
            return null;
          }
        }

        return {
          level,
          methods,
          metadata:
            metadataByName.get(move.rawName) ?? null,
          name: move.name,
          versions,
        };
      })
      .filter((move): move is DisplayMoveRow => move !== null),
    sortBy,
  );

  const levelUpMoves = filteredMoves.filter((move) => move.level !== null).length;
  const visibleMethods = uniqueLabels(
    filteredMoves.flatMap((move) => move.methods),
  );
  const activeFilters = [
    methodFilter !== "all" ? { label: "METHOD", value: methodFilter } : null,
    versionFilter !== "all" ? { label: "GAME", value: versionFilter } : null,
    acquisitionFilter !== "all"
      ? {
          label: "MODE",
          value:
            acquisitionFilter === "level-up" ? "Level-up only" : "Non level-up",
        }
      : null,
  ].filter(
    (
      filter,
    ): filter is {
      label: string;
      value: string;
    } => Boolean(filter),
  );

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-visible px-4 py-4 md:h-full md:overflow-hidden md:px-6 md:py-5">
      <div className="shrink-0 rounded-md border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-lg border border-border bg-background/55 px-2 py-1 text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
              Total
            </p>
            <p className="text-xs font-semibold text-foreground">
              {filteredMoves.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background/55 px-2 py-1 text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
              Level-Up
            </p>
            <p className="text-xs font-semibold text-foreground">
              {levelUpMoves}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background/55 px-2 py-1 text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
              Methods
            </p>
            <p className="text-xs font-semibold text-foreground">
              {visibleMethods.length}
            </p>
          </div>
          <p className="ml-auto text-[11px] font-medium text-muted-foreground">
            {movePoolQuery.isPending
              ? "Loading battle data..."
              : `Showing ${filteredMoves.length} / ${allMoves.length}`}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Search
            </span>
            <Input
              autoComplete="off"
              className="h-8 px-2.5 py-1.5 text-[13px]"
              name="move-search"
              onChange={(event) =>
                startTransition(() => setSearch(event.target.value))
              }
              placeholder="Search moves…"
              type="search"
              value={search}
            />
          </label>

          <FilterSelect
            label="Method"
            onChange={(value) => startTransition(() => setMethodFilter(value))}
            options={[
              { label: "All methods", value: "all" },
              ...allMethods.map((method) => ({ label: method, value: method })),
            ]}
            value={methodFilter}
          />

          <FilterSelect
            label="Game"
            onChange={(value) => startTransition(() => setVersionFilter(value))}
            options={[
              { label: "All games", value: "all" },
              ...allVersions.map((version) => ({
                label: version,
                value: version,
              })),
            ]}
            value={versionFilter}
          />

        </div>

        {activeFilters.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border/70 pt-2">
            {activeFilters.map((filter) => (
              <FilterTag
                key={`${filter.label}-${filter.value}`}
                className="bg-primary/10 border-primary/60 hover:bg-primary/20 cursor-pointer"
                label={filter.label}
                onRemove={() =>
                  startTransition(() => {
                    if (filter.label === "METHOD") {
                      setMethodFilter("all");
                    }
                    if (filter.label === "GAME") {
                      setVersionFilter("all");
                    }
                    if (filter.label === "MODE") {
                      setAcquisitionFilter("all");
                    }
                  })
                }
                value={filter.value}
              />
            ))}
          </div>
        ) : null}
      </div>

      {filteredMoves.length > 0 ? (
        <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-card">
          <div className="overflow-x-auto md:h-full md:overflow-auto">
            <Table className="min-w-[1040px] table-fixed">
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[72px]">Lv</TableHead>
                  <TableHead className="w-[150px]">Move</TableHead>
                  <TableHead className="w-[92px]">Type</TableHead>
                  <TableHead className="w-[300px]">Effect</TableHead>
                  <TableHead className="w-[100px]">Category</TableHead>
                  <TableHead className="w-[72px] text-right">Power</TableHead>
                  <TableHead className="w-[60px] text-right">PP</TableHead>
                  <TableHead className="w-[84px] text-right">Accuracy</TableHead>
                  <TableHead className="w-[72px] text-right">Priority</TableHead>
                  <TableHead className="w-[110px]">Introduced</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMoves.map((move) => (
                  <TableRow key={move.name}>
                    <TableCell className="py-3 align-top font-mono text-xs font-semibold tabular-nums">
                      {move.level ?? "-"}
                    </TableCell>
                    <TableCell className="py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-foreground">{move.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {move.methods.join(", ")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 align-top">
                      {move.metadata?.type ? (
                        <span
                          className={cn(
                            "inline-flex rounded-[4px] border px-2 py-1 text-[10px] font-semibold uppercase",
                            pokemonTypeSurfaceClassName,
                          )}
                          style={getPokemonTypeStyle(move.metadata.type)}
                        >
                          {formatPokemonText(move.metadata.type)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 align-top text-xs leading-5 text-foreground/80">
                      {move.metadata?.effect ?? "-"}
                    </TableCell>
                    <TableCell className="py-3 align-top text-xs font-medium">
                      {move.metadata?.category
                        ? formatPokemonText(move.metadata.category)
                        : "-"}
                    </TableCell>
                    <TableCell className="py-3 text-right align-top font-mono text-xs tabular-nums">
                      {move.metadata?.power ?? "-"}
                    </TableCell>
                    <TableCell className="py-3 text-right align-top font-mono text-xs tabular-nums">
                      {move.metadata?.pp ?? "-"}
                    </TableCell>
                    <TableCell className="py-3 text-right align-top font-mono text-xs tabular-nums">
                      {move.metadata?.accuracy != null
                        ? `${move.metadata.accuracy}%`
                        : "-"}
                    </TableCell>
                    <TableCell className="py-3 text-right align-top font-mono text-xs tabular-nums">
                      {move.metadata?.priority ?? "-"}
                    </TableCell>
                    <TableCell className="py-3 align-top text-xs">
                      {move.metadata?.generation
                        ? formatGeneration(move.metadata.generation)
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="shrink-0 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No move matched the current filters.
        </div>
      )}
    </div>
  );
}
