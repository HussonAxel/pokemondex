import { useEffect, useState } from "react";

import TabsComponent from "@/components/sidebarRight/tabs";
import { Badge } from "@/components/ui/badge";
import BadgeTypes from "@/components/ui/badge-type";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { PokemonDetailProvider } from "./pokemon-detail-context";
import { formatPokemonText } from "./utils";

export default function MainTab({ pokemonId }: { pokemonId: number }) {
  const pokemonQuery = useQuery({
    ...orpc.getPokemonSummary.queryOptions({ input: { id: pokemonId } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  const pokemon = pokemonQuery.data;

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
      label: "Introduced",
      value: pokemon.generation
        ? `Generation ${pokemon.generation}`
        : "Unknown",
    },
    {
      label: "Base XP",
      value: pokemon.baseExperience?.toString() ?? "Unknown",
    },
  ];

  return (
    <PokemonDetailProvider pokemonId={pokemonId}>
      <div className="flex min-h-full flex-col md:grid md:h-full md:min-h-0 md:grid-cols-[19rem_minmax(0,1fr)] lg:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="shrink-0 border-b bg-sidebar/55 md:min-h-0 md:overflow-y-auto md:border-b-0 md:border-r">
          <div className="flex flex-col gap-4 p-4">
            <header className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Pokemon profile</p>
                <h1 className="truncate text-xl font-semibold text-foreground">{pokemonName}</h1>
              </div>
              <Badge variant="outline">#{pokemonId.toString().padStart(4, "0")}</Badge>
            </header>

            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 md:grid-cols-1">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-background/70">
                <span className="absolute left-2 top-2 hidden font-mono text-[9px] uppercase text-muted-foreground md:block">Artwork</span>
                <img
                  src={previewSprite}
                  alt={previewAlt}
                  width={256}
                  height={256}
                  fetchPriority="high"
                  className={cn(
                    "size-24 object-contain md:size-52",
                    selectedSprite && "[image-rendering:pixelated]",
                  )}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <section aria-labelledby="pokemon-types-title">
                  <h2
                    id="pokemon-types-title"
                    className="finder-label"
                  >
                    Types
                  </h2>
                  <div className="flex flex-wrap items-center gap-1">
                <BadgeTypes
                  pokemonTypes={
                    pokemon.types.length > 1
                      ? [
                          pokemon.types[0].toLowerCase(),
                          pokemon.types[1].toLowerCase(),
                        ]
                      : [pokemon.types[0].toLowerCase()]
                  }
                  classNameBadge="px-2 py-1 text-[9px]"
                />
                  </div>
                </section>

                <section aria-labelledby="pokemon-abilities-title">
                  <h2
                    id="pokemon-abilities-title"
                    className="finder-label"
                  >
                    Abilities
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {pokemon.abilities.map((entry) => (
                      <Badge
                        key={`${entry.ability.name}-${entry.slot}`}
                        variant={entry.is_hidden ? "secondary" : "outline"}
                      >
                        {formatPokemonText(entry.ability.name)}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <section aria-labelledby="pokedex-entry-title">
              <h2
                id="pokedex-entry-title"
                className="finder-label"
              >
                Summary
              </h2>
              <p className="text-xs leading-5 text-foreground/75">
                {pokemonName} is a {pokemon.types.map(formatPokemonText).join(" / ")} Pokemon
                {pokemon.generation ? ` introduced in Generation ${pokemon.generation}` : ""}.
              </p>
            </section>

            <dl className="grid grid-cols-2 overflow-hidden rounded-md border bg-background/70">
              {physicalProfile.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`px-3 py-2.5 ${index % 2 === 0 ? "border-r" : ""} ${index > 1 ? "border-t" : ""}`}
                >
                  <dt className="text-xs font-medium text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
        <section className="min-h-[40rem] min-w-0 bg-background md:min-h-0">
          <TabsComponent
            onSelectSprite={(src, alt) => setSelectedSprite({ alt, src })}
            selectedSpriteSrc={selectedSprite?.src ?? null}
          />
        </section>
      </div>
    </PokemonDetailProvider>
  );
}
