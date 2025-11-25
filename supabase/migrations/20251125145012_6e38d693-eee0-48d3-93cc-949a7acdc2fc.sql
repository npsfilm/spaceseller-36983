-- Add reason column to photographer_availability for individual unavailability entries
ALTER TABLE photographer_availability 
ADD COLUMN IF NOT EXISTS reason TEXT;

-- Add recurring pattern support to profiles (weekday numbers: 1=Mon, 7=Sun)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS available_weekdays INTEGER[] DEFAULT '{1,2,3,4,5}';