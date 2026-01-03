-- Script SQL pour supprimer les tables Pokémon
-- ⚠️ ATTENTION : Cela supprimera toutes les données Pokémon de votre base de données

-- Supprimer les tables (dans l'ordre pour respecter les contraintes)
DROP TABLE IF EXISTS "pokemon" CASCADE;
DROP TABLE IF EXISTS "pokemon_sync" CASCADE;

-- Vérifier que les tables ont été supprimées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('pokemon', 'pokemon_sync');

