-- Update services table with photography packages according to calculator documentation
-- First, disable all current services
UPDATE services SET is_active = false;

-- Photography Packages (Immobilienshooting)
INSERT INTO services (name, description, category, base_price, unit, features, is_active) VALUES
('Immobilienshooting Basis', '15-20 professionelle Bilder, 1-1,5 Stunden Shooting', 'photography', 149, 'per_shoot', 
 '["15-20 hochauflösende Bilder", "1-1,5 Stunden vor Ort", "Professionelle Nachbearbeitung", "Innen- und Außenaufnahmen"]'::jsonb, true),

('Immobilienshooting Standard', '25-30 professionelle Bilder, 1,5-2 Stunden Shooting', 'photography', 199, 'per_shoot',
 '["25-30 hochauflösende Bilder", "1,5-2 Stunden vor Ort", "Erweiterte Nachbearbeitung", "Alle Räume & Außenbereich"]'::jsonb, true),

('Immobilienshooting Premium', '40-50 professionelle Bilder, 2,5-3 Stunden Shooting', 'photography', 299, 'per_shoot',
 '["40-50 hochauflösende Bilder", "2,5-3 Stunden vor Ort", "Premium Nachbearbeitung", "Detailaufnahmen inklusive"]'::jsonb, true),

('Immobilienshooting Exklusiv', '60-80 professionelle Bilder, 3,5-4 Stunden Shooting', 'photography', 449, 'per_shoot',
 '["60-80 hochauflösende Bilder", "3,5-4 Stunden vor Ort", "Exklusive Nachbearbeitung", "Komplette Dokumentation"]'::jsonb, true);

-- Drone Shooting Packages
INSERT INTO services (name, description, category, base_price, unit, features, is_active) VALUES
('Drohnenshooting Basis', '8-12 Luftaufnahmen, perfekt für Übersichten', 'photography', 199, 'per_shoot',
 '["8-12 hochauflösende Drohnenbilder", "Luftperspektive der Immobilie", "Umgebungsaufnahmen", "Professionelle Nachbearbeitung"]'::jsonb, true),

('Drohnenshooting Standard', '15-20 Luftaufnahmen mit verschiedenen Perspektiven', 'photography', 299, 'per_shoot',
 '["15-20 hochauflösende Drohnenbilder", "Multiple Perspektiven", "Weitwinkel & Detail", "Premium Nachbearbeitung"]'::jsonb, true),

('Drohnenshooting Premium', '25-30 Luftaufnahmen, komplette Luftdokumentation', 'photography', 449, 'per_shoot',
 '["25-30 hochauflösende Drohnenbilder", "Komplette Luftdokumentation", "360° Perspektiven", "Exklusive Nachbearbeitung"]'::jsonb, true);

-- Combo Packages
INSERT INTO services (name, description, category, base_price, unit, features, is_active) VALUES
('Kombi-Paket Basis', 'Immobilien + Drohne Basis, 30 Bilder gesamt', 'photography', 299, 'per_shoot',
 '["30 Bilder gesamt", "Innen- und Außenaufnahmen", "Luftaufnahmen", "Komplettpaket zum Sparpreis"]'::jsonb, true),

('Kombi-Paket Standard', 'Immobilien + Drohne Standard, 45 Bilder gesamt', 'photography', 399, 'per_shoot',
 '["45 Bilder gesamt", "Erweiterte Innen-/Außenaufnahmen", "Premium Luftaufnahmen", "Beste Preis-Leistung"]'::jsonb, true),

('Kombi-Paket Premium', 'Immobilien + Drohne Premium, 70 Bilder gesamt', 'photography', 549, 'per_shoot',
 '["70 Bilder gesamt", "Premium Dokumentation", "Umfangreiche Luftaufnahmen", "Komplettlösung"]'::jsonb, true);

-- Editing Services
INSERT INTO services (name, description, category, base_price, unit, features, is_active) VALUES
('Bildoptimierung', 'Professionelle Nachbearbeitung pro Bild', 'editing', 3, 'per_image',
 '["Farbkorrektur", "Belichtungsoptimierung", "Kontrastanpassung", "Schärfung"]'::jsonb, true),

('Objektretusche', 'Entfernung störender Objekte pro Bild', 'editing', 8, 'per_image',
 '["Objektentfernung", "Detailretusche", "Perspektivkorrektur", "Professionelle Bearbeitung"]'::jsonb, true);

-- Virtual Staging
INSERT INTO services (name, description, category, base_price, unit, features, is_active) VALUES
('Virtual Staging', 'Digitale Möblierung pro Raum - Mengenrabatt ab 3 Bildern', 'virtual_staging', 49, 'per_room',
 '["Realistische 3D-Möblierung", "Verschiedene Einrichtungsstile", "Hochauflösende Ausgabe", "10% ab 3 Bilder, 15% ab 5 Bilder"]'::jsonb, true);

-- Floor Plans
INSERT INTO services (name, description, category, base_price, unit, features, is_active) VALUES
('2D Grundriss', 'Professioneller 2D Grundriss', 'floor_plan', 79, 'per_plan',
 '["Maßstabsgetreue Darstellung", "Alle Räume beschriftet", "Flächenangaben", "Druckfertige Qualität"]'::jsonb, true),

('3D Grundriss', 'Interaktiver 3D Grundriss', 'floor_plan', 149, 'per_plan',
 '["3D-Visualisierung", "Interaktive Ansicht", "Möblierungsvorschlag", "Premium Darstellung"]'::jsonb, true);

-- Create upgrades table for add-on services
CREATE TABLE IF NOT EXISTS public.upgrades (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  base_price numeric NOT NULL,
  unit text NOT NULL,
  pricing_type text NOT NULL DEFAULT 'fixed',
  pricing_config jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for upgrades
ALTER TABLE public.upgrades ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing upgrades
CREATE POLICY "Upgrades are viewable by everyone"
ON public.upgrades
FOR SELECT
USING (is_active = true);

-- Insert upgrade options
INSERT INTO public.upgrades (name, description, category, base_price, unit, pricing_type) VALUES
('Zusätzliche Bilder +10', '10 zusätzliche professionelle Aufnahmen', 'photography', 49, 'fixed', 'fixed'),
('Zusätzliche Bilder +20', '20 zusätzliche professionelle Aufnahmen', 'photography', 89, 'fixed', 'fixed'),
('Zusätzliche Bilder +30', '30 zusätzliche professionelle Aufnahmen', 'photography', 119, 'fixed', 'fixed'),
('Video-Rundgang', 'Professioneller Video-Rundgang durch die Immobilie', 'photography', 149, 'fixed', 'fixed'),
('Grundrissplan', 'Professioneller 2D Grundriss der Immobilie', 'general', 79, 'fixed', 'fixed'),
('Dämmerungsaufnahmen', 'Stimmungsvolle Aufnahmen zur goldenen Stunde', 'photography', 99, 'fixed', 'fixed'),
('360° Rundgang', 'Interaktiver 360° virtueller Rundgang', 'photography', 199, 'fixed', 'fixed');

-- Create order_upgrades junction table
CREATE TABLE IF NOT EXISTS public.order_upgrades (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  upgrade_id uuid NOT NULL REFERENCES public.upgrades(id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for order_upgrades
ALTER TABLE public.order_upgrades ENABLE ROW LEVEL SECURITY;

-- Create policies for order_upgrades
CREATE POLICY "Users can view their own order upgrades"
ON public.order_upgrades
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_upgrades.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own order upgrades"
ON public.order_upgrades
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_upgrades.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own order upgrades"
ON public.order_upgrades
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_upgrades.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own order upgrades"
ON public.order_upgrades
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_upgrades.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Admin policies for order_upgrades
CREATE POLICY "Admins can view all order upgrades"
ON public.order_upgrades
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all order upgrades"
ON public.order_upgrades
FOR UPDATE
USING (is_admin(auth.uid()));

-- Add trigger for updated_at on upgrades
CREATE TRIGGER update_upgrades_updated_at
BEFORE UPDATE ON public.upgrades
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();