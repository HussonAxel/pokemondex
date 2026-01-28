import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

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

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {/* Habitat Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Habitat
          </h2>
        </div>
        <div className="group relative overflow-hidden">
          <p className="text-sm leading-relaxed text-foreground/90 relative z-10">
            {pokemon.locationAreaEncounters
              ? `Trouvé dans les zones de rencontre : ${pokemon.locationAreaEncounters}`
              : "Informations d'habitat non disponibles pour ce Pokémon."}
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
          <div className="group relative flex flex-col items-center justify-center ring ring-border rounded-md py-2 cursor-pointer hover:bg-accent/10">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Introduced
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              {generationText}
            </p>
          </div>
          <div className="group relative flex flex-col items-center justify-center ring ring-border rounded-md py-2 cursor-pointer hover:bg-accent/10">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Category
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              {pokemon.types && pokemon.types.length > 0
                ? pokemon.types[0].charAt(0).toUpperCase() +
                  pokemon.types[0].slice(1)
                : "Unknown"}
            </p>
          </div>
          <div className="group relative flex flex-col items-center justify-center ring ring-border rounded-md py-2 cursor-pointer hover:bg-accent/10">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Weight
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
              {weightInKg}kg
            </p>
          </div>
          <div className="group relative flex flex-col items-center justify-center ring ring-border rounded-md py-2 cursor-pointer hover:bg-accent/10">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
              Height
            </p>
            <p className="text-sm font-semibold text-foreground relative z-10">
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
                  <Tooltip key={`${abilityName}-${index}`}>
                    <TooltipTrigger
                      className={cn(
                        "group relative flex flex-col items-center justify-center ring ring-border rounded-md py-2 cursor-pointer hover:bg-accent/10",
                      )}
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
                        {isHidden ? "Hidden Ability" : "Ability"}
                      </p>
                      <p className="text-sm font-semibold text-foreground relative z-10">
                        {abilityName.charAt(0).toUpperCase() +
                          abilityName.slice(1)}
                      </p>
                    </TooltipTrigger>
                    <TooltipPopup
                      className="max-w-3/4 w-fit mx-auto text-center"
                      align="center"
                    >
                      {isHidden
                        ? `Capacité cachée : ${abilityName}`
                        : `Capacité : ${abilityName}`}
                    </TooltipPopup>
                  </Tooltip>
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
