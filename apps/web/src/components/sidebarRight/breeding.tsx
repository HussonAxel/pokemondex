import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePokemonDetailId } from "./pokemon-detail-context";

export default function BreedingComponent() {
  const pokemonId = usePokemonDetailId();
  const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;

  const species = useQuery({
    ...orpc.getPokemonSpeciesSummary.queryOptions({
      input: { url: pokemonSpeciesUrl },
    }),
    enabled: true,
  }).data;

  const growthRateUrl = species?.growth_rate.url ?? "";
  const growthRate = useQuery({
    ...orpc.getPokemonGrowthRateData.queryOptions({
      input: { url: growthRateUrl },
    }),
    enabled: Boolean(growthRateUrl),
  }).data;

  if (!species) return null;

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
  const numberFormatter = new Intl.NumberFormat("en-US");

  return (
    <div className="flex w-full flex-col gap-5 p-4 md:p-5 lg:p-6">
      <div className="border-b pb-4">
        <p className="font-mono text-[10px] font-medium uppercase text-muted-foreground">
          Nursery data
        </p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">
          Breeding profile
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Egg compatibility, hatch requirements and species growth pattern.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Egg Groups
        </h2>
        <div className="flex flex-wrap gap-2">
          {species.egg_groups && species.egg_groups.length > 0 ? (
            species.egg_groups.map((group: any) => (
              <Badge
                key={group.name}
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

      <div className="grid grid-cols-2 overflow-hidden rounded-md border border-border bg-card lg:grid-cols-4">
        <div className="relative flex min-h-28 flex-col items-center justify-center border-b border-r border-border px-3 py-4 lg:border-b-0">
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

        <div className="relative flex min-h-28 flex-col items-center justify-center border-b border-border px-3 py-4 lg:border-b-0 lg:border-r">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
            Egg Cycles
          </p>
          <p className="text-sm font-medium text-foreground relative z-10">
            {species.hatch_counter} cycles
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1 relative z-10">
            ~{numberFormatter.format(hatchSteps)} steps
          </p>
        </div>

        <div className="relative flex min-h-28 flex-col items-center justify-center border-r border-border px-3 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
            Growth Rate
          </p>
          <p className="text-sm font-medium text-foreground relative z-10 capitalize">
            {species.growth_rate.name}
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1 relative z-10">
            {numberFormatter.format(maxLevelXP)} XP
          </p>
        </div>

        <div className="relative flex min-h-28 flex-col items-center justify-center px-3 py-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1.5 relative z-10">
            Habitat
          </p>
          <p className="text-sm font-medium text-foreground relative z-10 capitalize">
            {species.habitat?.name || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
