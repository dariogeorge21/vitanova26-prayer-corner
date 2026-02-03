-- =====================================================
-- Vitanova 2026 Prayer Repository - Supabase Schema
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to set up
-- the database for the Prayer Repository application.
-- =====================================================

-- 1. Create the prayer_types table
-- This stores the different types of prayers users can log
CREATE TABLE IF NOT EXISTS prayer_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('count', 'minutes')),
  icon_name TEXT,
  display_order INT DEFAULT 0
);

-- 2. Create the prayer_logs table
-- This stores individual prayer submissions
CREATE TABLE IF NOT EXISTS prayer_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_type_id INT NOT NULL REFERENCES prayer_types(id) ON DELETE CASCADE,
  value INT NOT NULL DEFAULT 1,
  device_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create index for efficient spam prevention queries
-- This helps quickly check the last submission from a device
CREATE INDEX IF NOT EXISTS idx_prayer_logs_device_time 
ON prayer_logs(device_hash, created_at DESC);

-- 4. Create index for aggregation queries
CREATE INDEX IF NOT EXISTS idx_prayer_logs_type 
ON prayer_logs(prayer_type_id);

-- 5. Create the prayer_aggregates view
-- This provides real-time totals for each prayer type
CREATE OR REPLACE VIEW prayer_aggregates AS
SELECT 
  prayer_type_id,
  COALESCE(SUM(value), 0)::INT as total
FROM prayer_logs
GROUP BY prayer_type_id;

-- 6. Seed the prayer types data
-- Insert the 9 prayer types for Vitanova 2026
INSERT INTO prayer_types (id, name, unit, icon_name, display_order) VALUES
  (1, 'Holy Mass', 'count', 'Church', 1),
  (2, 'Rosary', 'count', 'CircleDot', 2),
  (3, 'Adoration', 'minutes', 'Sun', 3),
  (4, 'Word of God', 'minutes', 'BookOpen', 4),
  (5, 'Memorare', 'count', 'Heart', 5),
  (6, 'Creed', 'count', 'Shield', 6),
  (7, 'Hail Mary', 'count', 'Star', 7),
  (8, 'Way of the Cross', 'count', 'Cross', 8),
  (9, 'Novena of St. Joseph', 'count', 'Flower2', 9)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE prayer_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Allow anyone to read prayer types
CREATE POLICY "Allow public read access to prayer_types"
ON prayer_types FOR SELECT
USING (true);

-- Allow anyone to insert prayer logs (anonymous submissions)
CREATE POLICY "Allow public insert to prayer_logs"
ON prayer_logs FOR INSERT
WITH CHECK (true);

-- Allow anyone to read prayer logs (for aggregates view)
CREATE POLICY "Allow public read access to prayer_logs"
ON prayer_logs FOR SELECT
USING (true);

-- 9. Enable Realtime for prayer_logs table
-- This allows the app to receive live updates
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_logs;

-- =====================================================
-- VERIFICATION QUERIES (Run these to verify setup)
-- =====================================================

-- Check prayer types were inserted:
-- SELECT * FROM prayer_types ORDER BY display_order;

-- Check aggregates view works:
-- SELECT pt.name, COALESCE(pa.total, 0) as total
-- FROM prayer_types pt
-- LEFT JOIN prayer_aggregates pa ON pt.id = pa.prayer_type_id
-- ORDER BY pt.display_order;

-- =====================================================
-- OPTIONAL: Reset all prayer data (USE WITH CAUTION)
-- =====================================================
-- TRUNCATE TABLE prayer_logs;
