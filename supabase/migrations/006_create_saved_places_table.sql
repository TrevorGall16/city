-- ============================================================================
-- Migration 006: Create saved_places table for favorites feature
-- Allows users to save/favorite places they want to visit
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_slug TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate saves
  UNIQUE(user_id, place_slug, city_slug)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_city_slug ON saved_places(city_slug);
CREATE INDEX IF NOT EXISTS idx_saved_places_place_slug ON saved_places(place_slug);
CREATE INDEX IF NOT EXISTS idx_saved_places_created_at ON saved_places(created_at DESC);

-- Enable Row Level Security
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own saved places
CREATE POLICY "Users can view their own saved places"
  ON saved_places FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own saved places
CREATE POLICY "Users can insert their own saved places"
  ON saved_places FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own saved places
CREATE POLICY "Users can delete their own saved places"
  ON saved_places FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Migration complete!
-- Users can now save/favorite places across the site.
