-- ============================================================================
-- Migration 008: Backfill legacy `favorites` → canonical `saved_places`
--
-- Background: migration 003 created `favorites(user_id, place_id, city_slug)`
-- where `place_id` actually stores a slug string (VARCHAR), not a UUID.
-- Migration 006 introduced `saved_places(user_id, place_slug, city_slug)`
-- as the canonical schema. This script copies every row over so the new
-- readers find the user's existing data.
--
-- Idempotent: re-running this migration is a no-op thanks to the UNIQUE
-- constraint on saved_places(user_id, place_slug, city_slug) + ON CONFLICT.
--
-- The legacy `favorites` table is intentionally NOT dropped here. We let
-- the new code run in production for a verification window, then drop
-- the legacy table in a follow-up migration.
-- ============================================================================

INSERT INTO saved_places (user_id, place_slug, city_slug, created_at)
SELECT
  f.user_id,
  f.place_id  AS place_slug,
  f.city_slug,
  f.created_at
FROM favorites f
WHERE f.user_id IS NOT NULL
  AND f.place_id IS NOT NULL
  AND f.city_slug IS NOT NULL
ON CONFLICT (user_id, place_slug, city_slug) DO NOTHING;
