-- ============================================================================
-- Migration 004: Add vote_count column and auto-update triggers
-- This ensures vote_count is always in sync with the votes table
-- ============================================================================

-- Add vote_count column to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS vote_count INTEGER DEFAULT 0 NOT NULL;

-- ============================================================================
-- TRIGGER FUNCTION: Auto-update comment vote_count
-- This function recalculates and updates the vote_count for a comment
-- whenever a vote is inserted, updated, or deleted
-- ============================================================================

CREATE OR REPLACE FUNCTION update_comment_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  target_comment_id UUID;
BEGIN
  -- Determine which comment_id to update
  -- For INSERT/UPDATE: use NEW.comment_id
  -- For DELETE: use OLD.comment_id
  IF TG_OP = 'DELETE' THEN
    target_comment_id := OLD.comment_id;
  ELSE
    target_comment_id := NEW.comment_id;
  END IF;

  -- Update the comment's vote_count by summing all votes for this comment
  UPDATE comments
  SET vote_count = (
    SELECT COALESCE(SUM(value), 0)
    FROM votes
    WHERE comment_id = target_comment_id
  )
  WHERE id = target_comment_id;

  -- Return the appropriate row for the trigger
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS: Execute vote_count update on any vote change
-- These triggers ensure vote_count stays synchronized automatically
-- ============================================================================

-- Drop existing triggers if they exist (for safe re-running)
DROP TRIGGER IF EXISTS trigger_update_vote_count_on_insert ON votes;
DROP TRIGGER IF EXISTS trigger_update_vote_count_on_update ON votes;
DROP TRIGGER IF EXISTS trigger_update_vote_count_on_delete ON votes;

-- Trigger on INSERT: When a new vote is added
CREATE TRIGGER trigger_update_vote_count_on_insert
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_vote_count();

-- Trigger on UPDATE: When a vote value changes (e.g., -1 to +1)
CREATE TRIGGER trigger_update_vote_count_on_update
  AFTER UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_vote_count();

-- Trigger on DELETE: When a vote is removed (value set to 0)
CREATE TRIGGER trigger_update_vote_count_on_delete
  AFTER DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_vote_count();

-- ============================================================================
-- INDEXES: Optimize sorting by vote_count and created_at
-- This makes ORDER BY vote_count DESC, created_at DESC very fast
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_comments_vote_count_created
  ON comments(vote_count DESC, created_at DESC);

-- ============================================================================
-- DATA MIGRATION: Backfill existing vote counts
-- Calculate and populate vote_count for all existing comments
-- ============================================================================

UPDATE comments
SET vote_count = (
  SELECT COALESCE(SUM(value), 0)
  FROM votes
  WHERE votes.comment_id = comments.id
);

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify the triggers work correctly:
-- ============================================================================
--
-- -- Test 1: Insert a vote and check if vote_count updates
-- INSERT INTO votes (user_id, comment_id, value)
-- VALUES ('some-user-id', 'some-comment-id', 1);
--
-- SELECT id, vote_count FROM comments WHERE id = 'some-comment-id';
-- -- Expected: vote_count should increase by 1
--
-- -- Test 2: Update a vote and check if vote_count updates
-- UPDATE votes SET value = -1
-- WHERE user_id = 'some-user-id' AND comment_id = 'some-comment-id';
--
-- SELECT id, vote_count FROM comments WHERE id = 'some-comment-id';
-- -- Expected: vote_count should decrease by 2 (from +1 to -1)
--
-- -- Test 3: Delete a vote and check if vote_count updates
-- DELETE FROM votes
-- WHERE user_id = 'some-user-id' AND comment_id = 'some-comment-id';
--
-- SELECT id, vote_count FROM comments WHERE id = 'some-comment-id';
-- -- Expected: vote_count should return to original value
-- ============================================================================

-- Migration complete!
-- The vote_count column will now stay automatically synchronized with the votes table.
