import { useSearch } from "@tanstack/react-router";
import { Route } from "@/routes/index";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

export default function BreedingComponent() {
  const searchParams = useSearch({ from: Route.id });
  const activePokemon = searchParams.activePokemon;
  const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${activePokemon}/`;
  
  const species = useQuery(orpc.getPokemonSpeciesData.queryOptions({ input: { url: pokemonSpeciesUrl } })).data;
  if (!species) return null;

  return (
    <div>breeding</div>
  )
}
