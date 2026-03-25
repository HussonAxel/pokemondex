import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getPokemonIdFromUrl } from "./utils";

import { formatPokemonText, formatStatName } from "./utils";

export default function TrainingRelationsComponent() {
  const navigate = useNavigate({ from: Route.id });

  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;

  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: activePokemon } }),
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
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto overflow-x-hidden px-4 py-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Base XP
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {pokemon.baseExperience ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            EV Yield
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {totalEvYield}
          </p>
        </div>
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Varieties
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {varieties.length}
          </p>
        </div>
        <div className="rounded-md border border-border px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Held Items
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {heldItems.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Effort Yield
        </h2>
        {evYield.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {evYield.map((stat) => (
              <Badge key={stat.label} variant="secondary" className="px-3 py-1.5">
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
          Related Varieties
        </h2>
        {varieties.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {varieties.map((variety) => (
              <Badge
                key={variety.pokemon.name}
                variant="outline"
                className="px-3 py-1.5 cursor-pointer"
                onClick={() =>
                  navigate({
                    to: ".",
                    search: {
                      ...searchParams,
                      activePokemon: getPokemonIdFromUrl(variety.pokemon.url),
                    },
                  })
                }
              >
                {formatPokemonText(variety.pokemon.name)}
              </Badge>
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
          Version Presence
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
