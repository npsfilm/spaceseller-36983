-- Create user_consents table for GDPR consent management
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('marketing', 'analytics', 'third_party')),
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, consent_type)
);

-- Enable RLS on user_consents
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Users can view their own consents
CREATE POLICY "Users can view their own consents"
ON public.user_consents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can manage their own consents
CREATE POLICY "Users can manage their own consents"
ON public.user_consents
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create data retention cleanup function (deletes orders older than 7 years)
CREATE OR REPLACE FUNCTION public.cleanup_old_orders()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.orders
  WHERE created_at < NOW() - INTERVAL '7 years'
    AND status IN ('completed', 'delivered', 'cancelled');
$$;

-- Create function to anonymize user data (for soft delete)
CREATE OR REPLACE FUNCTION public.anonymize_user_data(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Anonymize profile
  UPDATE public.profiles
  SET 
    email = 'deleted_' || _user_id || '@anonymized.local',
    vorname = 'Gelöscht',
    nachname = 'Gelöscht',
    telefon = NULL,
    firma = NULL,
    strasse = NULL,
    plz = NULL,
    stadt = NULL,
    city = NULL,
    postal_code = NULL,
    location_lat = NULL,
    location_lng = NULL,
    branche = NULL,
    aufmerksam_geworden_durch = NULL
  WHERE id = _user_id;
  
  -- Delete sensitive order data
  DELETE FROM public.order_uploads WHERE user_id = _user_id;
  DELETE FROM public.order_deliverables 
  WHERE order_id IN (SELECT id FROM public.orders WHERE user_id = _user_id);
  
  -- Anonymize addresses
  UPDATE public.addresses
  SET 
    strasse = 'Anonymisiert',
    hausnummer = NULL,
    plz = '00000',
    stadt = 'Anonymisiert',
    additional_info = NULL,
    latitude = NULL,
    longitude = NULL
  WHERE user_id = _user_id;
END;
$$;

-- Create updated_at trigger for user_consents
CREATE TRIGGER update_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();