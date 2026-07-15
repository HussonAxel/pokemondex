import { useEffect, useState } from "react";

import TabsComponent from "@/components/sidebarRight/tabs";
import BadgeTypes from "@/components/ui/badge-type";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { PokemonDetailProvider } from "./pokemon-detail-context";
import { formatPokemonText } from "./utils";

export default function MainTab({ pokemonId }: { pokemonId: number }) {
  const pokemonQuery = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: pokemonId } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  const pokemon = pokemonQuery.data;
  const speciesUrl = pokemon?.species?.url ?? "";
  const species = useQuery({
    ...orpc.getPokemonSpeciesData.queryOptions({
      input: { url: speciesUrl },
    }),
    enabled: Boolean(speciesUrl),
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
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
  const pokemonName = formatPokemonText(pokemon.name);
  const pokedexEntry = [...(species?.flavor_text_entries ?? [])]
    .reverse()
    .find((entry) => entry.language?.name === "en")
    ?.flavor_text?.replace(/[\n\f\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const physicalProfile = [
    {
      label: "Height",
      value: pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : "—",
    },
    {
      label: "Weight",
      value: pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : "—",
    },
    {
      label: "Shape",
      value: species?.shape?.name
        ? formatPokemonText(species.shape.name)
        : "Unknown",
    },
    {
      label: "Color",
      value: species?.color?.name
        ? formatPokemonText(species.color.name)
        : "Unknown",
    },
  ];

  return (
    <PokemonDetailProvider pokemonId={pokemonId}>
      <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_20rem] md:grid-rows-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <aside className="min-h-0 overflow-y-auto border-b border-border bg-card px-4 py-5 md:order-2 md:border-b-0 md:border-l md:px-6 md:py-6 lg:px-7">
          <div className="flex flex-col gap-5">
            <header className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-foreground">
                {pokemonName}
                <span className="font-mono text-base font-medium text-muted-foreground">
                  {" "}- #{pokemonId.toString().padStart(4, "0")}
                </span>
              </h1>
            </header>

            <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 md:grid-cols-1 md:gap-5">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted/25">
              <span className="absolute left-3 top-3 hidden font-mono text-[9px] font-medium uppercase text-muted-foreground md:block">
                Official artwork
              </span>
              <img
                src={previewSprite}
                alt={previewAlt}
                width={256}
                height={256}
                fetchPriority="high"
                className={cn(
                  "size-28 object-contain md:size-48",
                  selectedSprite && "[image-rendering:pixelated]",
                )}
              />
              </div>

              <div className="flex min-w-0 flex-col gap-4 md:px-1">
                <section aria-labelledby="pokemon-types-title">
                  <h2
                    id="pokemon-types-title"
                    className="font-mono text-[10px] font-medium uppercase text-muted-foreground"
                  >
                    Types
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
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
                </section>

                <section aria-labelledby="pokemon-abilities-title">
                  <h2
                    id="pokemon-abilities-title"
                    className="font-mono text-[10px] font-medium uppercase text-muted-foreground"
                  >
                    Abilities
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pokemon.abilities.map((entry) => (
                      <span
                        key={`${entry.ability.name}-${entry.slot}`}
                        className="rounded-[4px] border border-border bg-background px-2 py-1 text-xs font-medium text-foreground"
                      >
                        {formatPokemonText(entry.ability.name)}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <section aria-labelledby="pokedex-entry-title" className="md:px-1">
              <h2
                id="pokedex-entry-title"
                className="font-mono text-[10px] font-medium uppercase text-muted-foreground"
              >
                Pokedex Entry
              </h2>
              <p className="mt-2 text-sm leading-6 text-foreground/80">
                {pokedexEntry ?? "No Pokedex entry is available for this form."}
              </p>
            </section>

            <dl className="grid grid-cols-2 overflow-hidden rounded-md border border-border bg-background">
              {physicalProfile.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`px-4 py-3.5 ${index % 2 === 0 ? "border-r" : ""} ${index > 1 ? "border-t" : ""}`}
                >
                  <dt className="text-xs font-medium text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
        <section className="min-h-0 min-w-0 bg-background md:order-1">
          <TabsComponent
            onSelectSprite={(src, alt) => setSelectedSprite({ alt, src })}
            selectedSpriteSrc={selectedSprite?.src ?? null}
          />
        </section>
      </div>
    </PokemonDetailProvider>
  );
}
