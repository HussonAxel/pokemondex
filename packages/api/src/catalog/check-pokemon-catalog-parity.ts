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
  { page: 1, pageSize: 30, type: ["grass", "poison"], typeOperator: "is_any_of" },
  { page: 1, pageSize: 30, type: ["grass"], typeOperator: "is_not_any_of" },
  { page: 1, pageSize: 30, ability: ["chlorophyll"] },
  { page: 1, pageSize: 30, generation: 1, generationOperator: "is_not" },
  { page: 1, pageSize: 30, generation: 1, minBst: 500, maxBst: 650 },
  { page: 1, pageSize: 30, minBst: 500, maxBst: 650, bstOperator: "not_between" },
  { page: 1, pageSize: 30, type: ["fire"], generation: 1, filterJoin: "or" },
  { page: 2, pageSize: 2, pokemonIds: [1, 4, 7, 25, 150] },
];

function normalizeSearchTerms(search?: string) {
  return (search ?? "")
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

async function queryDatabaseCatalog(input: PokemonCatalogInput) {
  const searchClauses = [];
  const filterClauses = [];

  if (input.pokemonIds?.length) {
    const clause = inArray(pokemon.id, input.pokemonIds);
    filterClauses.push(input.pokemonIdsOperator === "is_not" ? sql`NOT (${clause})` : clause);
  }

  for (const term of normalizeSearchTerms(input.search)) {
    const pattern = `%${term}%`;
    searchClauses.push(sql`
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
    const clauses = input.type.map((type) =>
      sql`COALESCE(${pokemon.types}, '[]'::jsonb) @> ${JSON.stringify([type])}::jsonb`
    );
    const joined = sql.join(
      clauses,
      input.typeOperator === "includes_all" || !input.typeOperator ? sql` AND ` : sql` OR `,
    );
    filterClauses.push(input.typeOperator === "is_not_any_of" ? sql`NOT (${joined})` : sql`(${joined})`);
  }

  if (input.generation) {
    filterClauses.push(
      input.generationOperator === "is_not"
        ? sql`${pokemon.generation} IS DISTINCT FROM ${input.generation}`
        : sql`${pokemon.generation} = ${input.generation}`,
    );
  }

  const bstSql = sql<number>`(
    COALESCE((${pokemon.stats}->>'hp')::int, 0) +
    COALESCE((${pokemon.stats}->>'attack')::int, 0) +
    COALESCE((${pokemon.stats}->>'defense')::int, 0) +
    COALESCE((${pokemon.stats}->>'specialAttack')::int, 0) +
    COALESCE((${pokemon.stats}->>'specialDefense')::int, 0) +
    COALESCE((${pokemon.stats}->>'speed')::int, 0)
  )`;
  if (input.minBst !== undefined || input.maxBst !== undefined) {
    const first = input.minBst;
    const second = input.maxBst;
    const operator = input.bstOperator ??
      (first !== undefined && second !== undefined ? "between" : second !== undefined ? "less_than" : "greater_than");
    if (operator === "between") {
      filterClauses.push(sql`${bstSql} BETWEEN ${first ?? 0} AND ${second ?? 1200}`);
    } else if (operator === "not_between") {
      filterClauses.push(sql`${bstSql} NOT BETWEEN ${first ?? 0} AND ${second ?? 1200}`);
    } else if (operator === "less_than") {
      filterClauses.push(sql`${bstSql} <= ${second ?? first ?? 1200}`);
    } else if (operator === "equals") {
      filterClauses.push(sql`${bstSql} = ${first ?? 0}`);
    } else if (operator === "not_equals") {
      filterClauses.push(sql`${bstSql} <> ${first ?? 0}`);
    } else {
      filterClauses.push(sql`${bstSql} >= ${first ?? 0}`);
    }
  }

  if (input.ability?.length) {
    const clauses = input.ability.map((ability) => sql`
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(${pokemon.abilities}, '[]'::jsonb)) AS ability_elem
        WHERE ability_elem->'ability'->>'name' = ${ability}
      )
    `);
    const joined = sql.join(
      clauses,
      input.abilityOperator === "includes_all" || !input.abilityOperator ? sql` AND ` : sql` OR `,
    );
    filterClauses.push(input.abilityOperator === "is_not_any_of" ? sql`NOT (${joined})` : sql`(${joined})`);
  }

  const whereClauses = [...searchClauses];
  if (filterClauses.length) {
    whereClauses.push(sql`(${sql.join(filterClauses, input.filterJoin === "or" ? sql` OR ` : sql` AND `)})`);
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
