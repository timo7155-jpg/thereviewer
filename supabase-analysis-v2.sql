-- Run in Supabase SQL Editor
-- Adds best/worst review summaries and teaser insight to business_analysis

ALTER TABLE business_analysis ADD COLUMN IF NOT EXISTS best_review TEXT;
ALTER TABLE business_analysis ADD COLUMN IF NOT EXISTS worst_review TEXT;
ALTER TABLE business_analysis ADD COLUMN IF NOT EXISTS teaser_insight TEXT;
