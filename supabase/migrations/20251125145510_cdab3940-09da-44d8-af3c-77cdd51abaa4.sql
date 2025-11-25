-- Add keine_berufshaftpflicht column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS keine_berufshaftpflicht BOOLEAN DEFAULT false;

-- Change equipment column from TEXT to JSONB for structured data
-- First, backup existing text data by converting it to JSONB array format
UPDATE profiles 
SET equipment = jsonb_build_array(
  jsonb_build_object(
    'category', 'Sonstiges',
    'item', equipment
  )
)
WHERE equipment IS NOT NULL AND equipment != '';

-- Now alter the column type
ALTER TABLE profiles 
ALTER COLUMN equipment TYPE JSONB USING 
  CASE 
    WHEN equipment IS NULL THEN '[]'::jsonb
    WHEN equipment::text = '' THEN '[]'::jsonb
    ELSE equipment::jsonb
  END;

-- Set default to empty array
ALTER TABLE profiles 
ALTER COLUMN equipment SET DEFAULT '[]'::jsonb;