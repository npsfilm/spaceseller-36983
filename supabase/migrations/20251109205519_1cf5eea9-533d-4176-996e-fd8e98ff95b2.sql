-- Extend profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS telefon text,
ADD COLUMN IF NOT EXISTS firma text,
ADD COLUMN IF NOT EXISTS strasse text,
ADD COLUMN IF NOT EXISTS plz text,
ADD COLUMN IF NOT EXISTS stadt text,
ADD COLUMN IF NOT EXISTS land text DEFAULT 'Deutschland';

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM (
  'draft',
  'submitted',
  'in_progress',
  'completed',
  'delivered',
  'cancelled'
);

-- Create enum for address type
CREATE TYPE public.address_type AS ENUM (
  'shooting_location',
  'billing_address'
);

-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('photography', 'editing', 'virtual_staging', 'floor_plan')),
  name text NOT NULL,
  description text,
  base_price numeric NOT NULL,
  unit text NOT NULL CHECK (unit IN ('per_image', 'per_room', 'per_plan', 'per_shoot')),
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status public.order_status DEFAULT 'draft' NOT NULL,
  total_amount numeric DEFAULT 0 NOT NULL,
  delivery_deadline timestamp with time zone,
  special_instructions text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE RESTRICT NOT NULL,
  quantity integer DEFAULT 1 NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  item_notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create order_uploads table
CREATE TABLE public.order_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_at timestamp with time zone DEFAULT now()
);

-- Create order_deliverables table
CREATE TABLE public.order_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  delivered_at timestamp with time zone DEFAULT now()
);

-- Create addresses table
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  address_type public.address_type NOT NULL,
  strasse text NOT NULL,
  hausnummer text,
  plz text NOT NULL,
  stadt text NOT NULL,
  land text DEFAULT 'Deutschland' NOT NULL,
  additional_info text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('order-uploads', 'order-uploads', false, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/x-canon-cr2', 'image/x-nikon-nef', 'image/x-adobe-dng']),
  ('order-deliverables', 'order-deliverables', false, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'application/zip']);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read, admin write - for now everyone can read)
CREATE POLICY "Services are viewable by everyone"
ON public.services FOR SELECT
USING (is_active = true);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own order items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own order items"
ON public.order_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own order items"
ON public.order_items FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- RLS Policies for order_uploads
CREATE POLICY "Users can view their own order uploads"
ON public.order_uploads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own order uploads"
ON public.order_uploads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own order uploads"
ON public.order_uploads FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for order_deliverables
CREATE POLICY "Users can view their own order deliverables"
ON public.order_deliverables FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_deliverables.order_id
    AND orders.user_id = auth.uid()
  )
);

-- RLS Policies for addresses
CREATE POLICY "Users can view their own addresses"
ON public.addresses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses"
ON public.addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses FOR DELETE
USING (auth.uid() = user_id);

-- Storage RLS Policies for order-uploads bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'order-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own uploaded files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'order-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploaded files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'order-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage RLS Policies for order-deliverables bucket
CREATE POLICY "Users can view their own deliverables"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'order-deliverables' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_part text;
  count_part integer;
  new_number text;
BEGIN
  year_part := to_char(now(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO count_part
  FROM public.orders
  WHERE order_number LIKE 'SS-' || year_part || '-%';
  
  new_number := 'SS-' || year_part || '-' || LPAD(count_part::text, 4, '0');
  
  RETURN new_number;
END;
$$;

-- Insert service data
INSERT INTO public.services (category, name, description, base_price, unit, features) VALUES
-- Photography Services
('photography', 'Innenaufnahmen', 'Professionelle Immobilien-Innenaufnahmen', 149, 'per_shoot', '["bis zu 15 Fotos", "HDR-Bearbeitung", "24h Lieferung", "Professionelle Bearbeitung"]'),
('photography', 'Außenaufnahmen', 'Hochwertige Außenaufnahmen Ihrer Immobilie', 99, 'per_shoot', '["bis zu 10 Fotos", "Optimale Lichtverhältnisse", "24h Lieferung", "Profi-Bearbeitung"]'),
('photography', 'Drohnenaufnahmen', 'Beeindruckende Luftaufnahmen', 199, 'per_shoot', '["bis zu 10 Fotos", "4K Auflösung", "Luftbildperspektive", "Professionelle Bearbeitung"]'),
('photography', 'Dämmerungsaufnahmen', 'Stimmungsvolle Aufnahmen zur goldenen Stunde', 149, 'per_shoot', '["bis zu 5 Fotos", "Perfektes Timing", "Atmosphärische Beleuchtung", "Premium-Bearbeitung"]'),
('photography', 'Virtuelle Rundgänge', 'Interaktive 360° Touren', 299, 'per_shoot', '["bis zu 100m²", "Interaktive Navigation", "Online-Hosting", "Mobile optimiert"]'),
('photography', 'Komplett-Paket', 'Komplettlösung für Ihre Immobilie', 399, 'per_shoot', '["Innen- & Außenaufnahmen", "bis zu 25 Fotos", "Drohnenaufnahmen", "24h Express-Lieferung", "Premium-Bearbeitung"]'),

-- Editing Services
('editing', 'Basis-Retusche', 'Grundlegende Bildoptimierung', 8, 'per_image', '["Farb- & Helligkeitskorrektur", "Horizont begradigen", "Rauschreduzierung", "24h Lieferung"]'),
('editing', 'Premium-Retusche', 'Professionelle Bildbearbeitung', 12, 'per_image', '["Umfangreiche Retusche", "Objektentfernung", "Himmel-Austausch", "HDR-Bearbeitung", "24h Lieferung"]'),

-- Virtual Staging
('virtual_staging', 'Virtual Staging', 'Digitale Möblierung leerer Räume', 35, 'per_room', '["Fotorealistische Möblierung", "6 Stilrichtungen", "Unbegrenzte Revisionen", "48h Lieferung"]'),

-- Floor Plans
('floor_plan', '2D/3D Grundrisse', 'Professionelle Grundrisszeichnungen', 45, 'per_plan', '["2D & 3D Versionen", "Maßstabsgetreu", "Möblierte Ansicht", "24-48h Lieferung"]');