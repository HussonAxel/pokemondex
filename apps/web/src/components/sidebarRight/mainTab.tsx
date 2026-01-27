import TabsComponent from "@/components/sidebarRight/tabs";
import BadgeTypes from "@/components/ui/badge-type";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

export default function MainTab() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;

  const pokemon = useQuery({
    ...orpc.getPokemonOverview.queryOptions({ input: { id: activePokemon } }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }).data;
  if (!pokemon) return null;
  return (
    <div>
      <div className="flex flex-row gap-2 h-full max-h-[300px] p-4 justify-center items-center">
        <div className="flex flex-col gap-2 text-center">
          <img
            src={pokemon.spriteUrl || ""}
            alt={`${pokemon.name} Pokémon sprite`}
            width={160}
            height={160}
            fetchPriority="high"
            className="w-32 h-32"
          />
          <div className="flex flex-col">
            <p className="text-[10px] text-accent-foreground/60 font-normal">
              NATIONAL DEX #{pokemon.order?.toString().padStart(3, "0")}
            </p>
            <p className="text-[24px] font-bold">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </p>
            <div className="flex items-center gap-2 justify-center mt-2">
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
        </div>
      </div>
      <TabsComponent />
    </div>
  );
}
