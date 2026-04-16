-- Track which businesses we've already tried to scrape emails from
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS email_scrape_attempted_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_scrape_result text;

CREATE INDEX IF NOT EXISTS idx_businesses_email_scrape_attempted
  ON businesses(email_scrape_attempted_at);

NOTIFY pgrst, 'reload schema';
