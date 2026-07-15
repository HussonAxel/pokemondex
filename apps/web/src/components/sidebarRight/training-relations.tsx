import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getPokemonIdFromUrl } from "./utils";
import { usePokemonDetailId } from "./pokemon-detail-context";

import { formatPokemonText, formatStatName } from "./utils";

export default function TrainingRelationsComponent() {
  const navigate = useNavigate({ from: "/pokemon/$pokemonId" });
  const pokemonId = usePokemonDetailId();

  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }).data;

  if (!pokemon) {
    return null;
  }

  const evYield = (pokemon.statsDetails ?? [])
    .filter((stat) => stat.effort > 0)
    .map((stat) => ({
      label: formatStatName(stat.stat.name),
      value: stat.effort,
    }));
  const totalEvYield = evYield.reduce((sum, stat) => sum + stat.value, 0);
  const heldItems = pokemon.heldItems ?? [];
  const varieties = pokemon.varieties ?? [];
  const versionPresence = Array.from(
    new Set(
      (pokemon.gameIndices ?? []).map((entry) =>
        formatPokemonText(entry.version.name),
      ),
    ),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="border-b border-border pb-6">
        <p className="font-mono text-[10px] font-medium uppercase text-muted-foreground">
          Battle preparation
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Training profile
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Experience, effort yield, forms and game-specific item data.
        </p>
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border bg-card sm:grid-cols-4">
        <div className="border-b border-r border-border px-3 py-4 text-center sm:border-b-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Base XP
          </p>
          <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
            {pokemon.baseExperience ?? 0}
          </p>
        </div>
        <div className="border-b border-border px-3 py-4 text-center sm:border-b-0 sm:border-r">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            EV Yield
          </p>
          <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
            {totalEvYield}
          </p>
        </div>
        <div className="border-r border-border px-3 py-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Varieties
          </p>
          <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
            {varieties.length}
          </p>
        </div>
        <div className="px-3 py-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Held Items
          </p>
          <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
            {heldItems.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Effort Yield
        </h2>
        {evYield.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {evYield.map((stat) => (
              <Badge
                key={stat.label}
                variant="secondary"
                className="px-3 py-1.5"
              >
                +{stat.value} {stat.label}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No EV yield data is stored for this Pokemon.
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Forms &amp; varieties
        </h2>
        {varieties.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {varieties.map((variety) => (
              <Button
                key={variety.pokemon.name}
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/pokemon/$pokemonId",
                    params: {
                      pokemonId: String(
                        getPokemonIdFromUrl(variety.pokemon.url),
                      ),
                    },
                  })
                }
              >
                {formatPokemonText(variety.pokemon.name)}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No alternate varieties are linked to this Pokemon.
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Held Items
        </h2>
        {heldItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {heldItems.map((heldItem) => {
              const rarity = Math.max(
                0,
                ...heldItem.version_details.map((detail) => detail.rarity),
              );

              return (
                <div
                  key={heldItem.item.name}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {formatPokemonText(heldItem.item.name)}
                    </p>
                    <Badge variant="secondary" className="text-[10px]">
                      Max rarity {rarity}%
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {heldItem.version_details.length} version entries
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No held item data is stored for this Pokemon.
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Game Availability
        </h2>
        {versionPresence.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {versionPresence.map((version) => (
              <Badge key={version} variant="outline" className="px-3 py-1.5">
                {version}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No version index data is stored for this Pokemon.
          </p>
        )}
      </div>
    </div>
  );
}
