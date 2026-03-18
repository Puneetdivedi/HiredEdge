-- HiredEdge Database Schema
-- Run this in your Supabase SQL editor

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  job_title TEXT NOT NULL,
  company TEXT,
  match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  analysis_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster user lookups
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Allow all reads/writes for local development/demo (tighten with auth for production!)
CREATE POLICY "Allow all" ON analyses FOR ALL
USING (true)
WITH CHECK (true);
