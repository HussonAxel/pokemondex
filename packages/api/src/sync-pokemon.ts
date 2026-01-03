import { db, pokemon, pokemonSync } from "@my-better-t-app/db";
import { eq } from "drizzle-orm";

const POKEAPI_URL = "https://pokeapi.co/api/v2";

interface PokeAPIPokemon {
  id: number;
  name: string;
  sprites: {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
      dream_world?: {
        front_default: string | null;
      };
      home?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    versions?: Record<string, any>;
  };
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  past_types?: Array<{
    generation: { name: string; url: string };
    types: Array<{
      slot: number;
      type: { name: string; url: string };
    }>;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }>;
  past_abilities?: Array<{
    generation: { name: string; url: string };
    abilities: Array<{
      ability: { name: string; url: string } | null;
      is_hidden: boolean;
      slot: number;
    }>;
  }>;
  moves: Array<{
    move: { name: string; url: string };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: { name: string; url: string };
      version_group: { name: string; url: string };
    }>;
  }>;
  forms: Array<{ name: string; url: string }>;
  game_indices: Array<{
    game_index: number;
    version: { name: string; url: string };
  }>;
  held_items: Array<{
    item: { name: string; url: string };
    version_details: Array<{
      rarity: number;
      version: { name: string; url: string };
    }>;
  }>;
  species: { name: string; url: string };
  location_area_encounters: string;
  cries?: {
    latest: string | null;
    legacy: string | null;
  };
}

// Calculer la génération depuis l'ID
function getGeneration(id: number): number {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  if (id <= 1010) return 9;
  return 10; // Génération actuelle
}

// Transformer les stats de PokeAPI en format normalisé
function transformStats(stats: PokeAPIPokemon["stats"]) {
  const statsMap: Record<string, number> = {};
  stats.forEach((stat) => {
    const statName = stat.stat.name;
    if (statName === "hp") statsMap.hp = stat.base_stat;
    else if (statName === "attack") statsMap.attack = stat.base_stat;
    else if (statName === "defense") statsMap.defense = stat.base_stat;
    else if (statName === "special-attack")
      statsMap.specialAttack = stat.base_stat;
    else if (statName === "special-defense")
      statsMap.specialDefense = stat.base_stat;
    else if (statName === "speed") statsMap.speed = stat.base_stat;
  });

  return {
    hp: statsMap.hp || 0,
    attack: statsMap.attack || 0,
    defense: statsMap.defense || 0,
    specialAttack: statsMap.specialAttack || 0,
    specialDefense: statsMap.specialDefense || 0,
    speed: statsMap.speed || 0,
  };
}

export async function syncPokemon() {
  console.log("🔄 Début de la synchronisation des Pokémon...");

  // Mettre à jour le statut
  await db
    .insert(pokemonSync)
    .values({
      id: 1,
      syncStatus: "running",
      lastSyncAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pokemonSync.id,
      set: {
        syncStatus: "running",
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      },
    });

  try {
    // 1. Récupérer la liste de tous les Pokémon
    console.log("📥 Récupération de la liste des Pokémon...");
    const listResponse = await fetch(
      `${POKEAPI_URL}/pokemon?limit=-1&offset=0`
    );
    if (!listResponse.ok) {
      throw new Error(
        `Erreur lors de la récupération: ${listResponse.statusText}`
      );
    }

    const listData = (await listResponse.json()) as {
      count: number;
      results: Array<{ name: string; url: string }>;
    };
    const totalPokemon = listData.count;
    console.log(`✅ ${totalPokemon} Pokémon trouvés`);

    // 2. Récupérer les détails de chaque Pokémon (par batch pour éviter de surcharger)
    const batchSize = 10;
    let processed = 0;
    const pokemonData: Array<{
      id: number;
      name: string;
      spriteUrl: string | null;
      officialArtworkUrl: string | null;
      height: number;
      weight: number;
      baseExperience: number | null;
      order: number;
      isDefault: boolean;
      types: string[];
      pastTypes: string[];
      stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
      };
      generation: number;
      abilities: PokeAPIPokemon["abilities"];
      pastAbilities: PokeAPIPokemon["past_abilities"];
      moves: PokeAPIPokemon["moves"];
      forms: PokeAPIPokemon["forms"];
      gameIndices: PokeAPIPokemon["game_indices"];
      heldItems: PokeAPIPokemon["held_items"];
      species: PokeAPIPokemon["species"];
      locationAreaEncounters: string | null;
      sprites: PokeAPIPokemon["sprites"];
      cries: PokeAPIPokemon["cries"];
    }> = [];

    for (let i = 0; i < listData.results.length; i += batchSize) {
      const batch = listData.results.slice(i, i + batchSize);
      const batchPromises = batch.map(async (p) => {
        try {
          const detailResponse = await fetch(p.url);
          if (!detailResponse.ok) {
            console.warn(`⚠️ Erreur pour ${p.url}`);
            return null;
          }
          const pokemon = (await detailResponse.json()) as PokeAPIPokemon;

          // Vérifications de sécurité pour éviter les erreurs
          if (!pokemon || !pokemon.id || !pokemon.name) {
            console.warn(`⚠️ Données invalides pour ${p.url}`);
            return null;
          }

          // Gérer les types de manière sécurisée
          const types = Array.isArray(pokemon.types)
            ? pokemon.types
                .map((t) => t?.type?.name)
                .filter((name): name is string => !!name)
            : [];

          // past_types a une structure différente : [{ generation, types: [{ slot, type }] }]
          const pastTypes = Array.isArray(pokemon.past_types)
            ? pokemon.past_types.flatMap(
                (pt) =>
                  pt.types
                    ?.map((t) => t?.type?.name)
                    .filter((name): name is string => !!name) || []
              ) || []
            : [];

          // Vérifier que sprites existe
          if (!pokemon.sprites) {
            console.warn(
              `⚠️ Pas de sprites pour ${pokemon.name} (${pokemon.id})`
            );
          }

          return {
            id: pokemon.id,
            name: pokemon.name,
            spriteUrl: pokemon.sprites?.front_default || null,
            officialArtworkUrl:
              pokemon.sprites?.other?.["official-artwork"]?.front_default ||
              null,
            height: pokemon.height || 0,
            weight: pokemon.weight || 0,
            baseExperience: pokemon.base_experience ?? null,
            order: pokemon.order || 0,
            isDefault: pokemon.is_default ?? true,
            types: types.length > 0 ? types : [],
            pastTypes: pastTypes,
            stats: transformStats(pokemon.stats || []),
            generation: getGeneration(pokemon.id),
            abilities: pokemon.abilities || [],
            pastAbilities: pokemon.past_abilities || [],
            moves: pokemon.moves || [],
            forms: pokemon.forms || [],
            gameIndices: pokemon.game_indices || [],
            heldItems: pokemon.held_items || [],
            species: pokemon.species || null,
            locationAreaEncounters: pokemon.location_area_encounters || null,
            sprites: pokemon.sprites
              ? {
                  back_default: pokemon.sprites.back_default || null,
                  back_female: pokemon.sprites.back_female || null,
                  back_shiny: pokemon.sprites.back_shiny || null,
                  back_shiny_female: pokemon.sprites.back_shiny_female || null,
                  front_default: pokemon.sprites.front_default || null,
                  front_female: pokemon.sprites.front_female || null,
                  front_shiny: pokemon.sprites.front_shiny || null,
                  front_shiny_female:
                    pokemon.sprites.front_shiny_female || null,
                  other: pokemon.sprites.other || {},
                  versions: pokemon.sprites.versions || {},
                }
              : null,
            cries: pokemon.cries || { latest: null, legacy: null },
          };
        } catch (error) {
          console.warn(`⚠️ Erreur lors du fetch de ${p.url}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      pokemonData.push(
        ...(batchResults.filter((p) => p !== null) as typeof pokemonData)
      );
      processed += batch.length;

      console.log(
        `📊 Progression: ${processed}/${listData.results.length} (${Math.round(
          (processed / listData.results.length) * 100
        )}%)`
      );

      // Petit délai pour ne pas surcharger l'API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // 3. Insérer/Mettre à jour dans la base de données
    console.log("💾 Sauvegarde dans la base de données...");
    let saved = 0;

    for (const p of pokemonData) {
      await db
        .insert(pokemon)
        .values({
          id: p.id,
          name: p.name,
          spriteUrl: p.spriteUrl,
          officialArtworkUrl: p.officialArtworkUrl,
          height: p.height,
          weight: p.weight,
          baseExperience: p.baseExperience,
          order: p.order,
          isDefault: p.isDefault,
          types: p.types,
          pastTypes: p.pastTypes,
          stats: p.stats,
          generation: p.generation,
          abilities: p.abilities,
          pastAbilities: p.pastAbilities,
          moves: p.moves,
          forms: p.forms,
          gameIndices: p.gameIndices,
          heldItems: p.heldItems,
          species: p.species,
          locationAreaEncounters: p.locationAreaEncounters,
          sprites: p.sprites,
          cries: p.cries,
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: pokemon.id,
          set: {
            name: p.name,
            spriteUrl: p.spriteUrl,
            officialArtworkUrl: p.officialArtworkUrl,
            height: p.height,
            weight: p.weight,
            baseExperience: p.baseExperience,
            order: p.order,
            isDefault: p.isDefault,
            types: p.types,
            pastTypes: p.pastTypes,
            stats: p.stats,
            generation: p.generation,
            abilities: p.abilities,
            pastAbilities: p.pastAbilities,
            moves: p.moves,
            forms: p.forms,
            gameIndices: p.gameIndices,
            heldItems: p.heldItems,
            species: p.species,
            locationAreaEncounters: p.locationAreaEncounters,
            sprites: p.sprites,
            cries: p.cries,
            syncedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      saved++;
    }

    // 4. Mettre à jour le statut de synchronisation
    await db
      .update(pokemonSync)
      .set({
        syncStatus: "completed",
        lastSyncAt: new Date(),
        totalPokemon: saved,
        updatedAt: new Date(),
      })
      .where(eq(pokemonSync.id, 1));

    console.log(`✅ Synchronisation terminée: ${saved} Pokémon sauvegardés`);
    return { success: true, total: saved };
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);

    await db
      .update(pokemonSync)
      .set({
        syncStatus: "error",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        updatedAt: new Date(),
      })
      .where(eq(pokemonSync.id, 1));

    throw error;
  }
}
