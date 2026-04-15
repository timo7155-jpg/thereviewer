-- Run this once in Supabase SQL editor: https://supabase.com/dashboard/project/_/sql/new
CREATE TABLE IF NOT EXISTS outreach_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
  business_ids text[],
  recipient_email text NOT NULL,
  subject text,
  segment text,
  personalized_intro text,
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  open_count integer DEFAULT 0,
  clicked_at timestamptz,
  click_count integer DEFAULT 0,
  resend_id text,
  error text
);

CREATE INDEX IF NOT EXISTS idx_outreach_logs_token ON outreach_logs(token);
CREATE INDEX IF NOT EXISTS idx_outreach_logs_business ON outreach_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_outreach_logs_sent_at ON outreach_logs(sent_at DESC);

-- Allow service role to do everything (RLS permissive for now)
ALTER TABLE outreach_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON outreach_logs USING (true) WITH CHECK (true);
