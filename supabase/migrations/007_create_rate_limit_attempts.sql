-- ============================================================================
-- Migration 007: Centralized rate-limit ledger
--
-- Replaces the per-table count() approach with a single source of truth
-- so that rate limits remain consistent across serverless function invocations
-- on Netlify (where in-memory state is ephemeral).
--
-- Each row represents one attempt of a rate-limited action by a user.
-- Used by src/lib/rate-limit.ts and consumed by /api/comments, /api/votes,
-- /api/reports, /api/favorites.
-- ============================================================================

CREATE TABLE IF NOT EXISTS rate_limit_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Primary lookup index: count attempts by (user, action) inside a time window.
CREATE INDEX IF NOT EXISTS idx_rate_limit_attempts_lookup
  ON rate_limit_attempts (user_id, action, created_at DESC);

-- Secondary index used by the housekeeping purge job.
CREATE INDEX IF NOT EXISTS idx_rate_limit_attempts_created_at
  ON rate_limit_attempts (created_at);

ALTER TABLE rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Only the server-side service role / RLS-bypassing inserts should touch this.
-- Authenticated users can SELECT their own rows (useful for debug UIs); INSERTs
-- happen through API routes that already validated auth.
DROP POLICY IF EXISTS "rate_limit_select_own" ON rate_limit_attempts;
CREATE POLICY "rate_limit_select_own"
  ON rate_limit_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "rate_limit_insert_own" ON rate_limit_attempts;
CREATE POLICY "rate_limit_insert_own"
  ON rate_limit_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Housekeeping: drop rows older than 24h. Run via pg_cron or a scheduled
-- Supabase edge function. Function body is idempotent.
CREATE OR REPLACE FUNCTION purge_rate_limit_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM rate_limit_attempts
  WHERE created_at < NOW() - INTERVAL '24 hours';
$$;
