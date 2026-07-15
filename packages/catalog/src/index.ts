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
  ability?: string[];
  collection?: string;
  pokemonIds?: number[];
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

export function queryPokemonCatalog(
  items: readonly PokemonCatalogItem[],
  input: PokemonCatalogInput,
): PokemonCatalogPage {
  const searchTerms = normalizeCatalogSearchTerms(input.search);
  const pokemonIds = input.pokemonIds?.length
    ? new Set(input.pokemonIds)
    : undefined;

  const filteredItems = items.filter((item) => {
    if (pokemonIds && !pokemonIds.has(item.id)) return false;
    if (!searchTerms.every((term) => matchesSearchTerm(item, term))) {
      return false;
    }
    if (!(input.type ?? []).every((type) => item.types.includes(type))) {
      return false;
    }

    const abilities = [
      ...item.visibleAbilityNames,
      ...item.hiddenAbilityNames,
    ];
    return (input.ability ?? []).every((ability) => abilities.includes(ability));
  });

  const offset = (input.page - 1) * input.pageSize;

  return {
    items: filteredItems.slice(offset, offset + input.pageSize),
    total: filteredItems.length,
    page: input.page,
    pageSize: input.pageSize,
  };
}
