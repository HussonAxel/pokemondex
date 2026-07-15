import type { CSSProperties } from "react";

const pokemonTypeColors: Record<string, string> = {
  normal: "113 113 122",
  fire: "249 115 22",
  water: "59 130 246",
  electric: "234 179 8",
  grass: "34 197 94",
  ice: "6 182 212",
  fighting: "220 38 38",
  poison: "147 51 234",
  ground: "245 158 11",
  flying: "99 102 241",
  psychic: "236 72 153",
  bug: "132 204 22",
  rock: "120 113 108",
  ghost: "139 92 246",
  dragon: "79 70 229",
  dark: "71 85 105",
  steel: "148 163 184",
  fairy: "217 70 239",
};

export const pokemonTypeSurfaceClassName =
  "border-[rgb(var(--pokemon-type-color)/0.4)] bg-[rgb(var(--pokemon-type-color)/0.15)]";

export const pokemonTypeHoverClassName =
  "hover:bg-[rgb(var(--pokemon-type-color)/0.25)]";

export function getPokemonTypeStyle(type: string) {
  return {
    "--pokemon-type-color":
      pokemonTypeColors[type.toLowerCase()] ?? pokemonTypeColors.normal,
  } as CSSProperties;
}
