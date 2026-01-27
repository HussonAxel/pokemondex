import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

export default function TrainingRelationsComponent() {
    const searchParams = useSearch({ from: Route.id });
    const activePokemon = searchParams.activePokemon;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${activePokemon}/`;

    const pokemon = useQuery(orpc.getPokemonOverview.queryOptions({ input: { id: activePokemon } })).data;
    const species = useQuery(orpc.getPokemonSpeciesData.queryOptions({ input: { url: pokemonSpeciesUrl } })).data;


    const yieldEV = "test";


    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                    Training & Relations
                </h2>
                
            </div>
        </div>
    );
}
