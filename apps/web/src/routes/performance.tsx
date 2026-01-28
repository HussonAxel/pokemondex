import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { orpc, queryClient } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BadgeTypes from "@/components/ui/badge-type";

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  spriteUrl?: string | null;
  officialArtworkUrl?: string | null;
  generation?: number | null;
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  } | null;
  height?: number | null;
  weight?: number | null;
}

export const Route = createFileRoute("/performance")({
  component: PerformanceTestPage,
});

function PerformanceTestPage() {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"pokeapi" | "database" | null>(null);

  // Extract ID from PokeAPI URL
  const extractIdFromUrl = (url: string): number => {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? parseInt(match[1], 10) : 0;
  };

  const fetchPokemons = async (from: "pokeapi" | "database") => {
    setIsLoading(true);
    setError(null);
    setSource(from);
    const startTime = performance.now();

    try {
      let result;
      if (from === "pokeapi") {
        result = await queryClient.fetchQuery(orpc.getPokemons.queryOptions());
      } else {
        result = await queryClient.fetchQuery(
          orpc.getPokemonsMainData.queryOptions(),
        );
      }

      let pokemonData: PokemonData[] = [];

      if (from === "pokeapi") {
        // Transform PokeAPI data (only name and url)
        pokemonData = (result?.results || []).map((p: any) => {
          const id = extractIdFromUrl(p.url);
          return {
            id,
            name: p.name,
            types: [], // Not available from PokeAPI list endpoint
            spriteUrl: id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              : undefined,
          };
        });
      } else {
        // Transform database data (all fields available)
        pokemonData = (result?.results || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          types: p.types || [],
          generation: p.generation,
          stats: p.stats,
        }));
      }

      const endTime = performance.now();
      setDuration(endTime - startTime);
      setPokemons(pokemonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tous les Pokémon</h1>
          <p className="text-muted-foreground mt-2">
            Comparez les performances entre PokeAPI et la base de données locale
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchPokemons("pokeapi")}
            disabled={isLoading}
            variant={source === "pokeapi" ? "default" : "outline"}
          >
            {isLoading && source === "pokeapi"
              ? "Chargement..."
              : "Depuis PokeAPI"}
          </Button>
          <Button
            onClick={() => fetchPokemons("database")}
            disabled={isLoading}
            variant={source === "database" ? "default" : "outline"}
          >
            {isLoading && source === "database"
              ? "Chargement..."
              : "Depuis la DB"}
          </Button>
        </div>
      </div>

      {duration !== null && source && (
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Temps de chargement depuis{" "}
              {source === "pokeapi" ? "PokeAPI" : "la base de données locale"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <Badge variant="secondary" className="mt-1">
                  {source === "pokeapi" ? "🌐 PokeAPI" : "💾 Base de données"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Temps de chargement
                </p>
                <p className="text-2xl font-bold">{duration.toFixed(2)} ms</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Nombre de Pokémon
                </p>
                <p className="text-2xl font-bold">{pokemons.length}</p>
              </div>
              {duration < 50 && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800"
                >
                  ⚡ Très rapide
                </Badge>
              )}
              {duration >= 50 && duration < 200 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  ⚠ Rapide
                </Badge>
              )}
              {duration >= 200 && (
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-800"
                >
                  🐌 Lent
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-red-500">Erreur: {error}</p>
          </CardContent>
        </Card>
      )}

      {pokemons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pokemons.map((pokemon) => (
            <Card key={pokemon.id} className="overflow-hidden">
              <div className="flex flex-col items-center p-4 space-y-3">
                {pokemon.spriteUrl && (
                  <img
                    src={pokemon.spriteUrl}
                    alt={pokemon.name}
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="text-center space-y-2 w-full">
                  <p className="text-xs text-muted-foreground font-mono">
                    #{pokemon.id.toString().padStart(3, "0")}
                  </p>
                  <h3 className="font-semibold text-lg capitalize">
                    {pokemon.name}
                  </h3>
                  {pokemon.types && pokemon.types.length > 0 && (
                    <div className="flex justify-center">
                      <BadgeTypes pokemonTypes={pokemon.types} />
                    </div>
                  )}
                  {pokemon.generation && (
                    <p className="text-xs text-muted-foreground">
                      Génération {pokemon.generation}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pokemons.length === 0 && !isLoading && !error && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Cliquez sur "Charger les Pokémon" pour afficher les données
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
