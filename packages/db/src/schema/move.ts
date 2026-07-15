import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const pokemonMove = pgTable(
  "pokemon_move",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull().unique(),
    accuracy: integer("accuracy"),
    damageClass: text("damage_class").notNull(),
    effect: text("effect"),
    generation: text("generation").notNull(),
    power: integer("power"),
    pp: integer("pp"),
    priority: integer("priority").notNull(),
    type: text("type").notNull(),
    syncedAt: timestamp("synced_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("pokemon_move_type_idx").on(table.type),
  ],
);
