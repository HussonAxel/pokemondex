import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { formatPokemonText } from "./utils";

export default function OverviewComponent() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;

  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: activePokemon } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }).data;

  if (!pokemon) return null;

  const heightInMeters = pokemon.height
    ? (pokemon.height / 10).toFixed(1)
    : "0.0";
  const weightInKg = pokemon.weight ? (pokemon.weight / 10).toFixed(0) : "0";

  const generationText = pokemon.generation
    ? `Generation ${pokemon.generation}`
    : "Unknown";

  const abilities = pokemon.abilities || [];
  const habitatLabel = (() => {
    const encountersUrl = pokemon.locationAreaEncounters;

    if (!encountersUrl) {
      return "Habitat data isn't available for this Pokemon yet.";
    }

    const locationMatch = encountersUrl.match(/pokemon\/(\d+)\/encounters\/?$/);
    if (locationMatch) {
      return "Encounter records are available through the PokeAPI location dataset.";
    }

    return formatPokemonText(encountersUrl.split("/").filter(Boolean).at(-1));
  })();

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {/* Habitat Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Habitat
          </h2>
        </div>
        <div className="rounded-md border border-border/70 bg-muted/[0.18] px-3 py-3">
          <p className="relative z-10 text-sm leading-relaxed text-foreground/90">
            {habitatLabel}
          </p>
        </div>
      </div>

      {/* Misc Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Misc.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="group relative flex flex-col justify-center rounded-md border border-border/80 bg-muted/[0.15] px-3 py-3 transition-colors hover:bg-accent/10">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Introduced
            </p>
            <p className="text-sm font-semibold text-foreground">
              {generationText}
            </p>
          </div>
          <div className="group relative flex flex-col justify-center rounded-md border border-border/80 bg-muted/[0.15] px-3 py-3 transition-colors hover:bg-accent/10">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Category
            </p>
            <p className="text-sm font-semibold text-foreground">
              {pokemon.types && pokemon.types.length > 0
                ? pokemon.types[0].charAt(0).toUpperCase() +
                  pokemon.types[0].slice(1)
                : "Unknown"}
            </p>
          </div>
          <div className="group relative flex flex-col justify-center rounded-md border border-border/80 bg-muted/[0.15] px-3 py-3 transition-colors hover:bg-accent/10">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Weight
            </p>
            <p className="text-sm font-semibold text-foreground">
              {weightInKg}kg
            </p>
          </div>
          <div className="group relative flex flex-col justify-center rounded-md border border-border/80 bg-muted/[0.15] px-3 py-3 transition-colors hover:bg-accent/10">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Height
            </p>
            <p className="text-sm font-semibold text-foreground">
              {heightInMeters}m
            </p>
          </div>
        </div>
      </div>

      {/* Abilities Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Abilities
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          <TooltipProvider>
            {abilities.length > 0 ? (
              abilities.map((ability, index) => {
                const abilityName = ability.ability.name;
                const isHidden = ability.is_hidden;

                return (
                  <AbilityTooltip
                    key={`${abilityName}-${index}`}
                    abilityName={abilityName}
                    isHidden={isHidden}
                    url={ability.ability.url}
                  />
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Aucune capacité disponible
              </div>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

function AbilityTooltip({
  abilityName,
  isHidden,
  url,
}: {
  abilityName: string;
  isHidden: boolean;
  url?: string;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ability = useQuery({
    ...orpc.getPokemonAbilityData.queryOptions({
      input: { url: url ?? "" },
    }),
    enabled: Boolean(url),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  }).data;

  const prefetchAbility = () => {
    if (!url) return;

    const queryOptions = orpc.getPokemonAbilityData.queryOptions({
      input: { url },
    });
    const state = queryClient.getQueryState(queryOptions.queryKey);

    if (!state || Date.now() - (state.dataUpdatedAt ?? 0) > 30 * 60 * 1000) {
      queryClient.prefetchQuery({
        ...queryOptions,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
      });
    }
  };

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        className={cn(
          "group relative flex flex-col items-center justify-center rounded-md border py-2 transition-colors hover:bg-accent/40",
          isHidden ? "!border-primary/60" : "",
        )}
        onFocus={prefetchAbility}
        onMouseEnter={prefetchAbility}
      >
        <p className="relative z-10 text-sm font-semibold text-foreground">
          {formatPokemonText(abilityName)}
        </p>
      </TooltipTrigger>
      <TooltipPopup className="mx-auto w-80 max-w-[min(20rem,calc(100vw-2rem))]" align="center">
        <div className="space-y-2">
          <div className="space-y-1 border-b border-border/60 pb-2">
            <p className="text-sm font-semibold text-foreground">
              {formatPokemonText(abilityName)}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {isHidden ? "Hidden ability" : "Ability"}
            </p>
          </div>
          {!url ? (
            <p className="text-sm text-muted-foreground">No detail available.</p>
          ) : !ability ? (
            <p className="text-sm text-muted-foreground">
              Loading ability details...
            </p>
          ) : (
            <div className="space-y-2 text-left">
              {ability.shortEffect ? (
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {ability.shortEffect}
                </p>
              ) : null}

              <p className="text-xs leading-relaxed text-muted-foreground">
                {ability.effect ??
                  ability.flavorText ??
                  "No detailed description is available for this ability."}
              </p>

              {ability.generation ? (
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                  Introduced in {formatPokemonText(ability.generation)}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </TooltipPopup>
    </Tooltip>
  );
}
