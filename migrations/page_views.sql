-- Page view tracking (lightweight, admin-only analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id bigserial PRIMARY KEY,
  path text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON page_views USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
