-- Add location and service radius to photographer profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS service_radius_km INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Create photographer availability table
CREATE TABLE IF NOT EXISTS public.photographer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(photographer_id, date)
);

-- Enable RLS
ALTER TABLE public.photographer_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for photographer_availability
CREATE POLICY "Photographers can view their own availability"
  ON public.photographer_availability
  FOR SELECT
  USING (photographer_id = auth.uid());

CREATE POLICY "Photographers can manage their own availability"
  ON public.photographer_availability
  FOR ALL
  USING (photographer_id = auth.uid());

CREATE POLICY "Admins can view all photographer availability"
  ON public.photographer_availability
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all photographer availability"
  ON public.photographer_availability
  FOR ALL
  USING (is_admin(auth.uid()));

-- Add geocoding fields to addresses table
ALTER TABLE public.addresses
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS geocoded_at TIMESTAMP WITH TIME ZONE;

-- Create index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_addresses_location ON public.addresses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_photographer_availability_date ON public.photographer_availability(photographer_id, date);

-- Update trigger for photographer_availability
CREATE TRIGGER update_photographer_availability_updated_at
  BEFORE UPDATE ON public.photographer_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();