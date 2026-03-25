import { startTransition, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

import { formatPokemonText } from "./utils";

type SpriteSource = "core" | "other" | "versions";
type SpriteAsset = {
  id: string;
  label: string;
  shortLabel: string;
  src: string;
  source: SpriteSource;
  sourceLabel: string;
  generationKey: string | null;
  generationLabel: string | null;
  setKey: string | null;
  setLabel: string | null;
  mediaType: string;
  pathLabel: string;
  tags: string[];
};

type SelectProps = {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
};

type SpritesComponentProps = {
  onSelectSprite: (src: string, alt: string) => void;
  selectedSpriteSrc: string | null;
};

function FilterSelect({ label, onChange, options, value }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <select
        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
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

function splitTokens(value: string) {
  return value.split(/[-_]/g).filter(Boolean);
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function getMediaType(src: string) {
  const cleanSrc = src.split("?")[0]?.toLowerCase() ?? "";

  if (cleanSrc.endsWith(".gif")) {
    return "gif";
  }
  if (cleanSrc.endsWith(".svg")) {
    return "svg";
  }
  if (cleanSrc.endsWith(".webp")) {
    return "webp";
  }
  if (cleanSrc.endsWith(".jpg") || cleanSrc.endsWith(".jpeg")) {
    return "jpg";
  }

  return "png";
}

function createSpriteAsset(path: string[], src: string): SpriteAsset {
  const rootSegment = path[0] ?? "core";
  const source: SpriteSource =
    rootSegment === "versions" || rootSegment === "other" ? rootSegment : "core";
  const leafKey = path[path.length - 1] ?? "sprite";
  const nestedScope =
    source === "core" ? [] : path.slice(1, Math.max(1, path.length - 1));
  const pathLabel = path.map((segment) => formatPokemonText(segment)).join(" / ");

  let generationKey: string | null = null;
  let generationLabel: string | null = null;
  let setKey: string | null = null;
  let setLabel: string | null = null;
  let scopeParts: string[] = [];

  if (source === "versions") {
    generationKey = path[1] ?? null;
    generationLabel = generationKey ? formatPokemonText(generationKey) : null;
    setKey = path[2] ?? null;
    setLabel = setKey ? formatPokemonText(setKey) : null;
    scopeParts = path.slice(1, Math.max(1, path.length - 1)).map(formatPokemonText);
  } else if (source === "other") {
    setKey = path[1] ?? null;
    setLabel = setKey ? formatPokemonText(setKey) : null;
    scopeParts = path.slice(1, Math.max(1, path.length - 1)).map(formatPokemonText);
  } else {
    setKey = "core";
    setLabel = "Core";
  }

  const tags = uniqueValues(
    [
      ...splitTokens(leafKey),
      ...nestedScope.flatMap(splitTokens),
      source,
      getMediaType(src),
    ].map((token) => token.toLowerCase()),
  );

  return {
    id: path.join("."),
    label:
      scopeParts.length > 0
        ? `${scopeParts.join(" / ")} / ${formatPokemonText(leafKey)}`
        : formatPokemonText(leafKey),
    shortLabel: formatPokemonText(leafKey),
    src,
    source,
    sourceLabel:
      source === "core" ? "Core" : source === "other" ? "Other" : "Versions",
    generationKey,
    generationLabel,
    setKey,
    setLabel,
    mediaType: getMediaType(src),
    pathLabel,
    tags,
  };
}

function collectSpriteAssets(
  value: unknown,
  path: string[] = [],
  assets: SpriteAsset[] = [],
): SpriteAsset[] {
  if (typeof value === "string" && value.length > 0) {
    assets.push(createSpriteAsset(path, value));
    return assets;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return assets;
  }

  for (const [key, nextValue] of Object.entries(value)) {
    collectSpriteAssets(nextValue, [...path, key], assets);
  }

  return assets;
}
function getSpriteContext(asset: SpriteAsset) {
  return uniqueValues(
    [
      asset.generationLabel?.replace(/^Generation\s+/i, "Gen "),
      asset.setLabel !== asset.sourceLabel ? asset.setLabel : null,
    ].filter(
      (value): value is string => Boolean(value),
    ),
  );
}

function SpriteCard({
  asset,
  isSelected,
  onSelect,
}: {
  asset: SpriteAsset;
  isSelected: boolean;
  onSelect: (asset: SpriteAsset) => void;
}) {
  const contextItems = getSpriteContext(asset);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card/60 p-3 shadow-sm shadow-black/10 transition-colors",
        isSelected ? "border-primary bg-primary/5" : "border-border/80",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(asset)}
        className={cn(
          "flex min-h-32 items-center justify-center rounded-lg bg-[linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%,transparent_75%,hsl(var(--muted))_75%),linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%,transparent_75%,hsl(var(--muted))_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] p-2 outline-none transition-[transform,box-shadow] hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isSelected ? "ring-2 ring-primary ring-offset-2" : "",
        )}
        aria-label={`Select sprite ${asset.label}`}
        aria-pressed={isSelected}
      >
        <img
          src={asset.src}
          alt={asset.label}
          className="h-28 w-28 object-contain"
          loading="lazy"
        />
      </button>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
              {asset.shortLabel}
            </p>
            {contextItems.length > 0 ? (
              <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-muted-foreground/85">
                {contextItems.join(" / ")}
              </p>
            ) : null}
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-border/80 bg-background/50 px-2 py-1 text-[10px] uppercase tracking-[0.14em]"
          >
            {asset.mediaType}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function SpritesComponent({
  onSelectSprite,
  selectedSpriteSrc,
}: SpritesComponentProps) {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;

  const [sourceFilter, setSourceFilter] = useState("all");
  const [setFilter, setSetFilter] = useState("all");
  const [variantFilter, setVariantFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");

  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: activePokemon } }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }).data;

  if (!pokemon) {
    return null;
  }

  const spriteTree = pokemon.sprites as Record<string, unknown> | null | undefined;
  const allAssets = collectSpriteAssets(spriteTree);


  const setCandidates = allAssets.filter((asset) => {
    if (sourceFilter !== "all" && asset.source !== sourceFilter) {
      return false;
    }


    return true;
  });
  const availableSets = uniqueValues(
    setCandidates
      .map((asset) => asset.setKey)
      .filter((value): value is string => Boolean(value)),
  ).sort((left, right) => formatPokemonText(left).localeCompare(formatPokemonText(right)));
  const availableVariantTags = uniqueValues(
    allAssets.flatMap((asset) => asset.tags),
  )
    .filter((tag) =>
      [
        "default",
        "shiny",
        "female",
        "back",
        "front",
        "animated",
        "transparent",
        "gray",
      ].includes(tag),
    )
    .sort((left, right) => left.localeCompare(right));
  const availableMediaTypes = uniqueValues(allAssets.map((asset) => asset.mediaType)).sort();

  useEffect(() => {
    if (
      setFilter !== "all" &&
      !availableSets.some((availableSet) => availableSet === setFilter)
    ) {
      setSetFilter("all");
    }
  }, [availableSets, setFilter]);

  const filteredAssets = allAssets.filter((asset) => {
    if (sourceFilter !== "all" && asset.source !== sourceFilter) {
      return false;
    }


    if (setFilter !== "all" && asset.setKey !== setFilter) {
      return false;
    }

    if (variantFilter !== "all" && !asset.tags.includes(variantFilter)) {
      return false;
    }

    if (mediaFilter !== "all" && asset.mediaType !== mediaFilter) {
      return false;
    }


    return [
      asset.label,
      asset.pathLabel,
      asset.sourceLabel,
      asset.generationLabel ?? "",
      asset.setLabel ?? "",
      asset.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase()
  });

  const shinyCount = allAssets.filter((asset) => asset.tags.includes("shiny")).length;
  const animatedCount = allAssets.filter((asset) =>
    asset.tags.includes("animated"),
  ).length;
  const versionedCount = allAssets.filter((asset) => asset.source === "versions").length;
  const cryCount = [pokemon.cries?.latest, pokemon.cries?.legacy].filter(Boolean).length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto overflow-x-hidden px-4 py-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Total Assets
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{allAssets.length}</p>
        </div>
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Versioned
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{versionedCount}</p>
        </div>
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Animated
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{animatedCount}</p>
        </div>
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Shiny
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{shinyCount}</p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card/30 p-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FilterSelect
            label="Source"
            onChange={(value) => startTransition(() => setSourceFilter(value))}
            options={[
              { label: "All sources", value: "all" },
              { label: "Core sprites", value: "core" },
              { label: "Other sets", value: "other" },
              { label: "Version sprites", value: "versions" },
            ]}
            value={sourceFilter}
          />
          <FilterSelect
            label="Variant"
            onChange={(value) => startTransition(() => setVariantFilter(value))}
            options={[
              { label: "All variants", value: "all" },
              ...availableVariantTags.map((tag) => ({
                label: formatPokemonText(tag),
                value: tag,
              })),
            ]}
            value={variantFilter}
          />

          <FilterSelect
            label="Media"
            onChange={(value) => startTransition(() => setMediaFilter(value))}
            options={[
              { label: "All media", value: "all" },
              ...availableMediaTypes.map((mediaType) => ({
                label: mediaType.toUpperCase(),
                value: mediaType,
              })),
            ]}
            value={mediaFilter}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="px-2 py-1 text-[10px]">
            Showing {filteredAssets.length} / {allAssets.length}
          </Badge>
          {setFilter !== "all" ? (
            <Badge variant="secondary" className="px-2 py-1 text-[10px]">
              Set: {formatPokemonText(setFilter)}
            </Badge>
          ) : null}
          {variantFilter !== "all" ? (
            <Badge variant="secondary" className="px-2 py-1 text-[10px]">
              {formatPokemonText(variantFilter)}
            </Badge>
          ) : null}
        </div>
      </div>

      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {filteredAssets.map((asset) => (
            <SpriteCard
              key={asset.id}
              asset={asset}
              isSelected={selectedSpriteSrc === asset.src}
              onSelect={(selectedAsset) =>
                onSelectSprite(selectedAsset.src, selectedAsset.label)
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No sprite matched the current filters.
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          cryCount > 1 ? "sm:grid-cols-2" : "",
        )}
      >
        {pokemon.cries?.latest ? (
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Latest Cry
            </p>
            <audio controls className="w-full" src={pokemon.cries.latest}>
              <track kind="captions" />
            </audio>
          </div>
        ) : null}
        {pokemon.cries?.legacy ? (
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Legacy Cry
            </p>
            <audio controls className="w-full" src={pokemon.cries.legacy}>
              <track kind="captions" />
            </audio>
          </div>
        ) : null}
      </div>
    </div>
  );
}
