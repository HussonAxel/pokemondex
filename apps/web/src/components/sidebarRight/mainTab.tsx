import { useEffect, useState } from "react";

import TabsComponent from "@/components/sidebarRight/tabs";
import BadgeTypes from "@/components/ui/badge-type";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { PokemonDetailProvider } from "./pokemon-detail-context";

export default function MainTab({ pokemonId }: { pokemonId: number }) {
  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }).data;

  const [selectedSprite, setSelectedSprite] = useState<{
    alt: string;
    src: string;
  } | null>(null);

  useEffect(() => {
    setSelectedSprite(null);
  }, [pokemonId]);

  if (!pokemon) return null;

  const previewSprite = selectedSprite?.src || pokemon.spriteUrl || "";
  const previewAlt = selectedSprite?.alt || `${pokemon.name} Pokemon sprite`;
  const heightInMeters = pokemon.height
    ? `${(pokemon.height / 10).toFixed(1)} m`
    : "Unknown";
  const weightInKilograms = pokemon.weight
    ? `${(pokemon.weight / 10).toFixed(1)} kg`
    : "Unknown";
  const quickFacts = [
    { label: "Height", value: heightInMeters },
    { label: "Weight", value: weightInKilograms },
    {
      label: "Generation",
      value: pokemon.generation ? `Gen ${pokemon.generation}` : "Unknown",
    },
    {
      label: "Base XP",
      value: pokemon.baseExperience?.toString() ?? "Unknown",
    },
  ];

  return (
    <PokemonDetailProvider pokemonId={pokemonId}>
      <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[18rem_minmax(0,1fr)] md:grid-rows-1 lg:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-b border-border bg-muted/10 px-4 py-5 md:border-r md:border-b-0 md:px-7 md:py-6 lg:px-8">
          <div className="flex items-center gap-5 md:flex-col md:items-stretch md:gap-6">
            <div className="flex size-32 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/35 md:aspect-square md:size-auto md:w-full">
              <img
                src={previewSprite}
                alt={previewAlt}
                width={256}
                height={256}
                fetchPriority="high"
                className="size-28 object-contain [image-rendering:pixelated] md:size-48 lg:size-52"
              />
            </div>
            <div className="flex min-w-0 flex-col md:px-1">
              <p className="font-mono text-xs font-medium uppercase text-muted-foreground">
                National Dex #{pokemonId.toString().padStart(4, "0")}
              </p>
              <h1 className="mt-1 truncate text-3xl font-bold text-foreground md:text-4xl">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h1>
              <div className="mt-3 flex items-center gap-2">
                <BadgeTypes
                  pokemonTypes={
                    pokemon.types.length > 1
                      ? [
                          pokemon.types[0].toLowerCase(),
                          pokemon.types[1].toLowerCase(),
                        ]
                      : [pokemon.types[0].toLowerCase()]
                  }
                />
              </div>
            </div>

            <dl className="hidden grid-cols-2 border-t border-border md:grid">
              {quickFacts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`py-4 ${index % 2 === 0 ? "border-r pr-4" : "pl-4"} ${index > 1 ? "border-t" : ""}`}
                >
                  <dt className="text-xs font-medium text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
        <section className="min-h-0 min-w-0 bg-background">
          <TabsComponent
            onSelectSprite={(src, alt) => setSelectedSprite({ alt, src })}
            selectedSpriteSrc={selectedSprite?.src ?? null}
          />
        </section>
      </div>
    </PokemonDetailProvider>
  );
}
