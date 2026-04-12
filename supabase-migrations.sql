-- =====================================================
-- Run these in Supabase SQL Editor (Dashboard > SQL)
-- =====================================================

-- 1. Business images table
CREATE TABLE IF NOT EXISTS business_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);

-- 2. Booking requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  booking_type TEXT NOT NULL, -- 'hotel', 'restaurant', 'service'
  check_in DATE,
  check_out DATE,
  booking_date DATE,
  booking_time TEXT,
  guests INT,
  seats INT,
  service_type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_business_id ON booking_requests(business_id);

-- 3. Create storage bucket for business images
-- Go to Supabase Dashboard > Storage > New Bucket
-- Name: "business-images"
-- Public: YES (so images load without auth)
-- Then add this policy:
INSERT INTO storage.policies (name, bucket_id, operation, definition)
SELECT 'Allow public read', 'business-images', 'SELECT', 'true'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.policies WHERE name = 'Allow public read' AND bucket_id = 'business-images'
);

-- NOTE: For the storage bucket, it's easier to do it in the Supabase Dashboard:
-- 1. Go to Storage
-- 2. Click "New Bucket"
-- 3. Name: business-images
-- 4. Toggle "Public bucket" ON
-- 5. Save
