import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  timestamp,
  jsonb,
  index,
  boolean,
} from "drizzle-orm/pg-core";

// Table principale pour les Pokémon
export const pokemon = pgTable(
  "pokemon",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    spriteUrl: text("sprite_url"),
    officialArtworkUrl: text("official_artwork_url"),
    height: integer("height"), // en décimètres
    weight: integer("weight"), // en hectogrammes
    baseExperience: integer("base_experience"),
    order: integer("order"),
    isDefault: boolean("is_default").default(true),

    // Types (stored as JSON array for flexibility)
    types: jsonb("types").$type<string[]>().notNull().default([]),
    pastTypes: jsonb("past_types").$type<string[]>().default([]),

    // Stats (stored as JSON object)
    stats: jsonb("stats").$type<{
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
    }>(),

    // Detailed stats as returned by PokeAPI (with EVs, stat names & urls)
    statsDetails: jsonb("stats_details").$type<
      Array<{
        base_stat: number;
        effort: number;
        stat: { name: string; url: string };
      }>
    >(),

    // Génération (calculée depuis l'ID)
    generation: integer("generation"),

    // Données supplémentaires (stored as JSONB)
    abilities: jsonb("abilities").$type<
      Array<{
        ability: { name: string; url: string };
        is_hidden: boolean;
        slot: number;
      }>
    >(),
    pastAbilities: jsonb("past_abilities").$type<
      Array<{
        generation: { name: string; url: string };
        abilities: Array<{
          ability: { name: string; url: string } | null;
          is_hidden: boolean;
          slot: number;
        }>;
      }>
    >(),
    moves: jsonb("moves").$type<
      Array<{
        move: { name: string; url: string };
        version_group_details: Array<{
          level_learned_at: number;
          move_learn_method: { name: string; url: string };
          version_group: { name: string; url: string };
        }>;
      }>
    >(),
    forms: jsonb("forms").$type<Array<{ name: string; url: string }>>(),
    gameIndices: jsonb("game_indices").$type<
      Array<{
        game_index: number;
        version: { name: string; url: string };
      }>
    >(),
    heldItems: jsonb("held_items").$type<
      Array<{
        item: { name: string; url: string };
        version_details: Array<{
          rarity: number;
          version: { name: string; url: string };
        }>;
      }>
    >(),
    species: jsonb("species").$type<{ name: string; url: string }>(),
    locationAreaEncounters: text("location_area_encounters"),

    // Sprites complets (toutes les variantes)
    sprites: jsonb("sprites").$type<{
      back_default?: string | null;
      back_female?: string | null;
      back_shiny?: string | null;
      back_shiny_female?: string | null;
      front_default?: string | null;
      front_female?: string | null;
      front_shiny?: string | null;
      front_shiny_female?: string | null;
      other?: {
        "official-artwork"?: { front_default?: string | null };
        dream_world?: { front_default?: string | null };
        home?: {
          front_default?: string | null;
          front_female?: string | null;
          front_shiny?: string | null;
          front_shiny_female?: string | null;
        };
      };
      versions?: Record<string, any>;
    }>(),

    // Cries
    cries: jsonb("cries").$type<{
      latest: string | null;
      legacy: string | null;
    }>(),

    // Métadonnées de synchronisation
    syncedAt: timestamp("synced_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("pokemon_name_idx").on(table.name),
    index("pokemon_generation_idx").on(table.generation),
    index("pokemon_synced_at_idx").on(table.syncedAt),
  ]
);

// Table pour suivre la dernière synchronisation
export const pokemonSync = pgTable("pokemon_sync", {
  id: integer("id").primaryKey().default(1), // Toujours 1, une seule entrée
  lastSyncAt: timestamp("last_sync_at").defaultNow().notNull(),
  totalPokemon: integer("total_pokemon").default(0),
  syncStatus: text("sync_status").default("idle"), // idle, running, completed, error
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const pokemonRelations = relations(pokemon, () => ({}));
