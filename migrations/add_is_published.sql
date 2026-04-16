-- Add is_published flag (existing businesses stay visible, new drafts hidden)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_businesses_published ON businesses(is_published) WHERE is_published = true;
NOTIFY pgrst, 'reload schema';
