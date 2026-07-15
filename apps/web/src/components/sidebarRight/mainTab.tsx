import { useEffect, useState } from "react";

import TabsComponent from "@/components/sidebarRight/tabs";
import BadgeTypes from "@/components/ui/badge-type";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Volume2 } from "lucide-react";
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

  const previewSprite =
    selectedSprite?.src ||
    pokemon.officialArtworkUrl ||
    pokemon.spriteUrl ||
    "";
  const previewAlt = selectedSprite?.alt || `${pokemon.name} official artwork`;
  const baseStatTotal = (pokemon.statsDetails ?? []).reduce(
    (total, stat) => total + stat.base_stat,
    0,
  );
  const quickFacts = [
    { label: "Base stats", value: baseStatTotal.toString() },
    { label: "Abilities", value: pokemon.abilities.length.toString() },
    { label: "Moves", value: pokemon.moves.length.toString() },
    { label: "Forms", value: pokemon.varieties.length.toString() },
  ];

  const playLatestCry = () => {
    if (!pokemon.cries?.latest) return;

    const audio = new Audio(pokemon.cries.latest);
    audio.volume = 0.45;
    void audio.play().catch(() => undefined);
  };

  return (
    <PokemonDetailProvider pokemonId={pokemonId}>
      <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[19rem_minmax(0,1fr)] md:grid-rows-1 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-b border-border bg-muted/10 px-4 py-5 md:border-r md:border-b-0 md:px-7 md:py-7 lg:px-8">
          <div className="flex items-center gap-5 md:flex-col md:items-stretch md:gap-6">
            <div className="flex size-32 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background/55 md:aspect-square md:size-auto md:w-full">
              <img
                src={previewSprite}
                alt={previewAlt}
                width={256}
                height={256}
                fetchPriority="high"
                className={cn(
                  "size-28 object-contain md:size-52",
                  selectedSprite && "[image-rendering:pixelated]",
                )}
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
              {pokemon.cries?.latest ? (
                <Button
                  className="mt-4 w-fit md:w-full"
                  onClick={playLatestCry}
                  size="sm"
                  variant="outline"
                >
                  <Volume2 />
                  Play latest cry
                </Button>
              ) : null}
            </div>

            <dl className="hidden grid-cols-2 border-y border-border md:grid">
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
