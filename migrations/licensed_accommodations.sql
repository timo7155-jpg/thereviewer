-- Fields for officially licensed businesses (e.g. Rodrigues Tourism Commission list)
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS license_type text,     -- 'Hotel', 'Tourist Residence', 'Chambre d''Hotes', 'Gite', 'Guest House'
  ADD COLUMN IF NOT EXISTS owner_name text,       -- Licensed applicant / representative name
  ADD COLUMN IF NOT EXISTS is_licensed boolean DEFAULT false;  -- Trust badge flag

CREATE INDEX IF NOT EXISTS idx_businesses_is_licensed ON businesses(is_licensed) WHERE is_licensed = true;

NOTIFY pgrst, 'reload schema';
