import { inArray, sql } from "drizzle-orm";

import { db, pokemon } from "@my-better-t-app/db";
import catalogJson from "../../../../apps/web/src/generated/pokemon-catalog.json";
import {
  pokemonCatalogSchema,
  queryPokemonCatalog,
  type PokemonCatalogInput,
} from "@my-better-t-app/catalog";

const catalog = pokemonCatalogSchema.parse(catalogJson);

const parityCases: PokemonCatalogInput[] = [
  { page: 1, pageSize: 30 },
  { page: 12, pageSize: 30 },
  { page: 1, pageSize: 30, search: "char, fire" },
  { page: 1, pageSize: 30, search: "mega, dragon" },
  { page: 1, pageSize: 30, type: ["grass", "poison"] },
  { page: 1, pageSize: 30, ability: ["chlorophyll"] },
  { page: 2, pageSize: 2, pokemonIds: [1, 4, 7, 25, 150] },
];

function normalizeSearchTerms(search?: string) {
  return (search ?? "")
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

async function queryDatabaseCatalog(input: PokemonCatalogInput) {
  const whereClauses = [];

  if (input.pokemonIds?.length) {
    whereClauses.push(inArray(pokemon.id, input.pokemonIds));
  }

  for (const term of normalizeSearchTerms(input.search)) {
    const pattern = `%${term}%`;
    whereClauses.push(sql`
      (
        CAST(${pokemon.id} AS text) ILIKE ${pattern}
        OR ${pokemon.name} ILIKE ${pattern}
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements_text(COALESCE(${pokemon.types}, '[]'::jsonb)) AS type_elem
          WHERE type_elem ILIKE ${pattern}
        )
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
          WHERE ability_elem->'ability'->>'name' ILIKE ${pattern}
        )
      )
    `);
  }

  if (input.type?.length) {
    whereClauses.push(
      sql`COALESCE(${pokemon.types}, '[]'::jsonb) @> ${JSON.stringify(input.type)}::jsonb`,
    );
  }

  for (const ability of input.ability ?? []) {
    whereClauses.push(sql`
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
        WHERE ability_elem->'ability'->>'name' = ${ability}
      )
    `);
  }

  const whereSql = whereClauses.length
    ? sql`WHERE ${sql.join(whereClauses, sql` AND `)}`
    : sql``;
  const offset = (input.page - 1) * input.pageSize;
  const [countResult, rowsResult] = await Promise.all([
    db.execute<{ count: number }>(sql`
      SELECT COUNT(*)::int AS count FROM ${pokemon} ${whereSql}
    `),
    db.execute<{ id: number }>(sql`
      SELECT ${pokemon.id} AS id FROM ${pokemon} ${whereSql}
      ORDER BY ${pokemon.id} LIMIT ${input.pageSize} OFFSET ${offset}
    `),
  ]);

  return {
    total: countResult.rows[0]?.count ?? 0,
    ids: rowsResult.rows.map((row) => row.id),
  };
}

export async function checkPokemonCatalogParity() {
  for (const input of parityCases) {
    const expected = await queryDatabaseCatalog(input);
    const actual = queryPokemonCatalog(catalog, input);
    const actualIds = actual.items.map((item) => item.id);

    if (
      expected.total !== actual.total ||
      JSON.stringify(expected.ids) !== JSON.stringify(actualIds)
    ) {
      throw new Error(
        `Catalog parity failed for ${JSON.stringify(input)}: expected ${JSON.stringify(expected)}, received ${JSON.stringify({ total: actual.total, ids: actualIds })}`,
      );
    }
  }

  return { checkedCases: parityCases.length };
}
