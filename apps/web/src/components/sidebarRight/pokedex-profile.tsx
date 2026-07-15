import { Badge } from "@/components/ui/badge";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpen, Sparkles } from "lucide-react";

import { usePokemonDetailId } from "./pokemon-detail-context";
import { formatPokemonText, formatStatName } from "./utils";

function SectionHeading({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof BookOpen;
  title: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/8 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function PokedexProfile() {
  const pokemonId = usePokemonDetailId();
  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }).data;

  if (!pokemon) return null;

  const stats = pokemon.statsDetails ?? [];
  const profileData = [
    {
      label: "Height",
      value: pokemon.height
        ? `${(pokemon.height / 10).toFixed(1)} m`
        : "Unknown",
    },
    {
      label: "Weight",
      value: pokemon.weight
        ? `${(pokemon.weight / 10).toFixed(1)} kg`
        : "Unknown",
    },
    {
      label: "Introduced",
      value: pokemon.generation
        ? `Generation ${pokemon.generation}`
        : "Unknown",
    },
    {
      label: "Base experience",
      value: pokemon.baseExperience?.toString() ?? "Unknown",
    },
    {
      label: "Pokédex order",
      value: pokemon.order?.toString() ?? "Unknown",
    },
    {
      label: "Default form",
      value: pokemon.isDefault ? "Yes" : "No",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <section className="min-w-0">
          <SectionHeading
            description="Core Pokédex information for this form."
            icon={BookOpen}
            title="Pokédex data"
          />
          <dl className="mt-6 grid overflow-hidden rounded-md border border-border bg-card sm:grid-cols-2">
            {profileData.map((item, index) => (
              <div
                key={item.label}
                className={`flex min-h-16 items-center justify-between gap-4 px-4 py-3 ${
                  index < profileData.length - 2 ? "border-b" : ""
                } ${index % 2 === 0 ? "sm:border-r" : ""} ${
                  index === profileData.length - 2 ? "border-b sm:border-b-0" : ""
                }`}
              >
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-start gap-3 border-l-2 border-primary bg-primary/5 px-4 py-3">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
            <p className="text-sm leading-6 text-muted-foreground">
              {pokemon.locationAreaEncounters
                ? "Encounter records are available for this Pokémon across supported game versions."
                : "Encounter records are not available for this Pokémon yet."}
            </p>
          </div>
        </section>

        <section className="min-w-0 border-t border-border pt-8 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
          <SectionHeading
            description="Battle traits, including hidden abilities."
            icon={Sparkles}
            title="Abilities"
          />
          <div className="mt-6 grid gap-2">
            {pokemon.abilities.length > 0 ? (
              pokemon.abilities.map((entry, index) => (
                <div
                  key={`${entry.ability.name}-${index}`}
                  className="group flex min-h-16 items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-3 transition-[background-color,border-color] duration-150 hover:border-primary/30 hover:bg-primary/5 motion-reduce:transition-none"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {formatPokemonText(entry.ability.name)}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                      Ability slot {entry.slot}
                    </p>
                  </div>
                  <Badge variant={entry.is_hidden ? "secondary" : "outline"}>
                    {entry.is_hidden ? "Hidden" : "Standard"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="border-t border-border py-4 text-sm text-muted-foreground">
                No ability data is available for this form.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="border-t border-border pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading
            description="Species values before level, nature and training modifiers."
            icon={BarChart3}
            title="Base stats"
          />
        </div>

        <div className="mt-7 grid gap-x-12 gap-y-5 lg:grid-cols-2">
          {stats.map((stat) => {
            const percentage = Math.min(100, (stat.base_stat / 255) * 100);

            return (
              <div
                key={stat.stat.name}
                className="grid grid-cols-[7rem_2.75rem_minmax(0,1fr)] items-center gap-3"
              >
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {formatStatName(stat.stat.name)}
                </span>
                <span className="text-right font-mono text-sm font-semibold tabular-nums text-foreground">
                  {stat.base_stat}
                </span>
                <div className="h-2 overflow-hidden rounded-sm bg-muted">
                  <div
                    className="h-full rounded-sm bg-primary transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
