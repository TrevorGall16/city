-- ============================================================================
-- Migration 005: Create reports table for comment moderation
-- Allows users to report inappropriate comments for safety compliance
-- ============================================================================

CREATE TABLE IF NOT EXISTS comment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate reports from same user for same comment
  UNIQUE(comment_id, reporter_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comment_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_reporter_id ON comment_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON comment_reports(status);
CREATE INDEX IF NOT EXISTS idx_comment_reports_created_at ON comment_reports(created_at DESC);

-- Enable Row Level Security
ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comment_reports
-- Anyone authenticated can insert a report
CREATE POLICY "Authenticated users can insert reports"
  ON comment_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
  ON comment_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Only admins can update/delete reports (placeholder for future admin role)
-- For now, no one can update/delete except through direct DB access

-- Trigger for updated_at
CREATE TRIGGER update_comment_reports_updated_at
  BEFORE UPDATE ON comment_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migration complete!
-- Users can now report inappropriate comments for moderation.
