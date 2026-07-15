import { createContext, useContext, type ReactNode } from "react";

const PokemonDetailContext = createContext<number | null>(null);

export function PokemonDetailProvider({
  children,
  pokemonId,
}: {
  children: ReactNode;
  pokemonId: number;
}) {
  return (
    <PokemonDetailContext.Provider value={pokemonId}>
      {children}
    </PokemonDetailContext.Provider>
  );
}

export function usePokemonDetailId() {
  const pokemonId = useContext(PokemonDetailContext);

  if (pokemonId === null) {
    throw new Error("usePokemonDetailId must be used within PokemonDetailProvider");
  }

  return pokemonId;
}
