-- City Sheet Database Schema
-- Following 05_Data_API specification
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends auth.users with display information
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COMMENTS TABLE
-- User-generated tips and recommendations
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  city_slug TEXT NOT NULL,
  place_slug TEXT,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_city_slug ON comments(city_slug);
CREATE INDEX IF NOT EXISTS idx_comments_place_slug ON comments(place_slug) WHERE place_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Comments
CREATE POLICY "comments_select_policy"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "comments_insert_policy"
  ON comments FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = user_id
  );

CREATE POLICY "comments_update_policy"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete_policy"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VOTES TABLE
-- Upvote/downvote system for comments
-- ============================================================================

CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_votes_comment_id ON votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Enable Row Level Security
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Votes
CREATE POLICY "votes_select_policy"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "votes_insert_policy"
  ON votes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = user_id
  );

CREATE POLICY "votes_update_policy"
  ON votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_delete_policy"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- Helper functions for aggregations and operations
-- ============================================================================

-- Function to get total vote score for a comment
CREATE OR REPLACE FUNCTION get_comment_score(comment_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(value), 0)::INTEGER
  FROM votes
  WHERE comment_id = comment_uuid;
$$ LANGUAGE SQL STABLE;

-- Function to get user's vote on a comment
CREATE OR REPLACE FUNCTION get_user_vote(comment_uuid UUID, user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(value, 0)::INTEGER
  FROM votes
  WHERE comment_id = comment_uuid AND user_id = user_uuid;
$$ LANGUAGE SQL STABLE;

-- Function to upsert vote (atomic voting)
CREATE OR REPLACE FUNCTION upsert_vote(
  p_comment_id UUID,
  p_user_id UUID,
  p_value INTEGER
)
RETURNS void AS $$
BEGIN
  -- Check if value is valid
  IF p_value NOT IN (-1, 0, 1) THEN
    RAISE EXCEPTION 'Vote value must be -1, 0, or 1';
  END IF;

  -- If value is 0, delete the vote
  IF p_value = 0 THEN
    DELETE FROM votes
    WHERE comment_id = p_comment_id AND user_id = p_user_id;
  ELSE
    -- Otherwise, insert or update
    INSERT INTO votes (comment_id, user_id, value, created_at, updated_at)
    VALUES (p_comment_id, p_user_id, p_value, NOW(), NOW())
    ON CONFLICT (user_id, comment_id)
    DO UPDATE SET
      value = p_value,
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VIEWS
-- Materialized or regular views for common queries
-- ============================================================================

-- View to get comments with vote counts and user info
CREATE OR REPLACE VIEW comments_with_details AS
SELECT
  c.*,
  p.display_name,
  p.avatar_url,
  get_comment_score(c.id) as vote_count,
  (
    SELECT COUNT(*)::INTEGER
    FROM comments replies
    WHERE replies.parent_id = c.id
  ) as reply_count
FROM comments c
JOIN profiles p ON c.user_id = p.id;

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- Automatically update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- ============================================================================

-- Check if all tables exist
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Test the functions
-- SELECT get_comment_score('some-uuid-here');
