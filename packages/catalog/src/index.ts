import { z } from "zod";

export const pokemonCatalogItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  types: z.array(z.string()),
  visibleAbilityNames: z.array(z.string()),
  hiddenAbilityNames: z.array(z.string()),
  bst: z.number().int().nonnegative(),
  generation: z.number().int().positive().nullable(),
  speciesUrl: z.string().url().nullable(),
});

export const pokemonCatalogSchema = z.array(pokemonCatalogItemSchema);

export type PokemonCatalogItem = z.infer<typeof pokemonCatalogItemSchema>;

export type PokemonCatalogInput = {
  page: number;
  pageSize: number;
  search?: string;
  type?: string[];
  typeOperator?: "is_any_of" | "includes_all" | "is_not_any_of";
  ability?: string[];
  abilityOperator?: "is_any_of" | "includes_all" | "is_not_any_of";
  generation?: number;
  generationOperator?: "is" | "is_not";
  minBst?: number;
  maxBst?: number;
  bstOperator?:
    | "greater_than"
    | "less_than"
    | "between"
    | "not_between"
    | "equals"
    | "not_equals";
  filterJoin?: "and" | "or";
  collection?: string;
  pokemonIds?: number[];
  pokemonIdsOperator?: "is" | "is_not";
};

export type PokemonCatalogPage = {
  items: PokemonCatalogItem[];
  total: number;
  page: number;
  pageSize: number;
};

export function normalizeCatalogSearchTerms(search?: string) {
  return (search ?? "")
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

function matchesSearchTerm(item: PokemonCatalogItem, term: string) {
  return (
    String(item.id).includes(term) ||
    item.name.toLowerCase().includes(term) ||
    item.types.some((type) => type.toLowerCase().includes(term)) ||
    item.visibleAbilityNames.some((ability) =>
      ability.toLowerCase().includes(term),
    ) ||
    item.hiddenAbilityNames.some((ability) =>
      ability.toLowerCase().includes(term),
    )
  );
}

function matchesValues(
  availableValues: readonly string[],
  selectedValues: readonly string[],
  operator: "is_any_of" | "includes_all" | "is_not_any_of",
) {
  if (operator === "is_any_of") {
    return selectedValues.some((value) => availableValues.includes(value));
  }
  if (operator === "is_not_any_of") {
    return selectedValues.every((value) => !availableValues.includes(value));
  }
  return selectedValues.every((value) => availableValues.includes(value));
}

function matchesBst(itemBst: number, input: PokemonCatalogInput) {
  const first = input.minBst;
  const second = input.maxBst;
  const operator = input.bstOperator ??
    (first !== undefined && second !== undefined
      ? "between"
      : second !== undefined
        ? "less_than"
        : "greater_than");

  if (operator === "between") {
    return (first === undefined || itemBst >= first) &&
      (second === undefined || itemBst <= second);
  }
  if (operator === "not_between") {
    return (first !== undefined && itemBst < first) ||
      (second !== undefined && itemBst > second);
  }
  if (operator === "less_than") return second !== undefined ? itemBst <= second : first === undefined || itemBst <= first;
  if (operator === "equals") return first === undefined || itemBst === first;
  if (operator === "not_equals") return first === undefined || itemBst !== first;
  return first === undefined || itemBst >= first;
}

export function queryPokemonCatalog(
  items: readonly PokemonCatalogItem[],
  input: PokemonCatalogInput,
): PokemonCatalogPage {
  const searchTerms = normalizeCatalogSearchTerms(input.search);
  const pokemonIds = input.pokemonIds?.length
    ? new Set(input.pokemonIds)
    : undefined;

  const filteredItems = items.filter((item) => {
    if (!searchTerms.every((term) => matchesSearchTerm(item, term))) {
      return false;
    }
    const abilities = [
      ...item.visibleAbilityNames,
      ...item.hiddenAbilityNames,
    ];
    const criteria: boolean[] = [];

    if (pokemonIds) {
      const isIncluded = pokemonIds.has(item.id);
      criteria.push(input.pokemonIdsOperator === "is_not" ? !isIncluded : isIncluded);
    }
    if (input.type?.length) {
      criteria.push(matchesValues(item.types, input.type, input.typeOperator ?? "includes_all"));
    }
    if (input.ability?.length) {
      criteria.push(matchesValues(abilities, input.ability, input.abilityOperator ?? "includes_all"));
    }
    if (input.generation) {
      const isGeneration = item.generation === input.generation;
      criteria.push(input.generationOperator === "is_not" ? !isGeneration : isGeneration);
    }
    if (input.minBst !== undefined || input.maxBst !== undefined) {
      criteria.push(matchesBst(item.bst, input));
    }

    if (!criteria.length) return true;
    return input.filterJoin === "or" ? criteria.some(Boolean) : criteria.every(Boolean);
  });

  const offset = (input.page - 1) * input.pageSize;

  return {
    items: filteredItems.slice(offset, offset + input.pageSize),
    total: filteredItems.length,
    page: input.page,
    pageSize: input.pageSize,
  };
}
