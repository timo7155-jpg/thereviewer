-- Run in Supabase SQL Editor
-- Stores AI-generated analysis based on public review data

CREATE TABLE IF NOT EXISTS business_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'google', -- google, tripadvisor, etc.
  source_rating NUMERIC(2,1),
  source_review_count INT DEFAULT 0,
  service_score NUMERIC(2,1),
  cleanliness_score NUMERIC(2,1),
  location_score NUMERIC(2,1),
  food_score NUMERIC(2,1),
  value_score NUMERIC(2,1),
  overall_score NUMERIC(2,1),
  summary TEXT,
  strengths TEXT[],
  improvements TEXT[],
  analyzed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, source)
);

CREATE INDEX IF NOT EXISTS idx_business_analysis_business_id ON business_analysis(business_id);
