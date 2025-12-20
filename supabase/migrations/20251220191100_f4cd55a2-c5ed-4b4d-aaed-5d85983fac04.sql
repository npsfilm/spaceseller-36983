-- Create site-assets storage bucket for logo and favicon uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Admins can upload site assets
CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' AND
  is_admin(auth.uid())
);

-- RLS Policy: Admins can update site assets
CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' AND
  is_admin(auth.uid())
);

-- RLS Policy: Admins can delete site assets
CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' AND
  is_admin(auth.uid())
);

-- RLS Policy: Public can view site assets (logo, favicon need to be public)
CREATE POLICY "Public can view site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');