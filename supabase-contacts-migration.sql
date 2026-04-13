-- Run in Supabase SQL Editor
-- Adds phone and email columns to businesses (if not already present)

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS email TEXT;
