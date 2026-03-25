export function formatPokemonText(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatStatName(value: string | null | undefined) {
  switch (value) {
    case "hp":
      return "HP";
    case "special-attack":
      return "Sp. Atk";
    case "special-defense":
      return "Sp. Def";
    default:
      return formatPokemonText(value);
  }
}
