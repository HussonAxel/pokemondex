import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function BreedingComponent() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${activePokemon}/`;

  const species = useQuery(
    orpc.getPokemonSpeciesData.queryOptions({
      input: { url: pokemonSpeciesUrl },
    }),
  ).data;
  if (!species) return null;

  const growthRate = useQuery(
    orpc.getPokemonGrowthRateData.queryOptions({
      input: { url: species.growth_rate.url },
    }),
  ).data;

  if (!growthRate) return null;

  const getGenderRate = (rate: number) => {
    if (rate === -1) return { male: 0, female: 0, genderless: true };
    const female = (rate / 8) * 100;
    const male = 100 - female;
    return { male, female, genderless: false };
  };

  const genderInfo = getGenderRate(species.gender_rate);
  const hatchSteps = (species.hatch_counter + 1) * 255;
  const maxLevelXP = growthRate.levels[99]?.experience || 0;

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-medium text-foreground tracking-tight">
          Egg Groups
        </h2>
        <div className="flex flex-wrap gap-2">
          {species.egg_groups && species.egg_groups.length > 0 ? (
            species.egg_groups.map((group: any, index: number) => (
              <Badge
                key={`${group.name}-${index}`}
                variant="secondary"
                className="text-xs font-medium px-3 py-1.5 capitalize"
              >
                {group.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No egg groups</span>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div className="group relative flex flex-col items-center justify-center ring ring-1 ring-border rounded-md py-3 cursor-pointer">
          {genderInfo.genderless ? (
            <>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
                Gender
              </p>
              <p className="text-sm font-medium text-foreground relative z-10">
                Genderless
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
                Gender Ratio
              </p>
              <div className="flex items-center gap-2 relative z-10">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-blue-500/50 font-medium">
                    ♂
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {genderInfo.male.toFixed(1)}%
                  </span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex flex-col items-center">
                  <span className="text-xs text-pink-500/70 font-medium">
                    ♀
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {genderInfo.female.toFixed(1)}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="group relative flex flex-col items-center justify-center ring ring-1 ring-border rounded-md py-3 cursor-pointer">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
            Egg Cycles
          </p>
          <p className="text-sm font-medium text-foreground relative z-10">
            {species.hatch_counter} cycles
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1 relative z-10">
            ~{hatchSteps.toLocaleString()} steps
          </p>
        </div>

        <div className="group relative flex flex-col items-center justify-center ring ring-1 ring-border rounded-md py-3 cursor-pointer">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
            Growth Rate
          </p>
          <p className="text-sm font-medium text-foreground relative z-10 capitalize">
            {species.growth_rate.name}
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1 relative z-10">
            {maxLevelXP.toLocaleString()} XP
          </p>
        </div>

        <div className="group relative flex flex-col items-center justify-center ring ring-1 ring-border rounded-md py-3 cursor-pointer">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
            Habitat
          </p>
          <p className="text-sm font-medium text-foreground relative z-10 capitalize">
            {species.habitat?.name || "Unknown"}
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex justify-center">
        <Button variant="primary" size="default" className="w-full rounded-sm">
          Breeding Calculator
        </Button>
      </div>
    </div>
  );
}
