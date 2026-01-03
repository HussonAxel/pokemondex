import { data } from "@/data/data";
import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import BadgeTypes from "@/components/ui/badge-type";
import TabsComponent from "@/components/sidebar--right/tabs";

export default function MainTab() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  const pokemon = data.find((pokemon) => pokemon.name === activePokemon);

  return (
    <div>
      <div className="flex flex-row gap-2 h-full max-h-[300px] p-4 justify-center items-center">
        {pokemon && (
          <div className="flex flex-col gap-2 text-center">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
              className="w-40 h-40"
            />
            <div className="flex flex-col">
              <p className="text-[10px] text-accent-foreground/60 font-normal">
                NATIONAL DEX #{pokemon.id.toString().padStart(3, "0")}
              </p>
              <p className="text-[24px] font-bold">
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </p>
              <div className="flex items-center gap-2 justify-center mt-2">
                <BadgeTypes
                  pokemonTypes={
                    pokemon.secondType
                      ? [
                          pokemon.firstType.toLowerCase(),
                          pokemon.secondType.toLowerCase(),
                        ]
                      : [pokemon.firstType.toLowerCase()]
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <TabsComponent />
    </div>
  );
}
