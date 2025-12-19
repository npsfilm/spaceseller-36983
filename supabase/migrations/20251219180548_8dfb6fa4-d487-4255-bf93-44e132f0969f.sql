-- ==============================================
-- SITE SETTINGS TABLE (Global Website Settings)
-- ==============================================
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name text NOT NULL DEFAULT 'SpaceSeller',
  site_description text,
  logo_url text,
  favicon_url text,
  colors jsonb NOT NULL DEFAULT '{
    "primary": "202 100% 50%",
    "secondary": "160 84% 39%",
    "accent": "38 92% 50%",
    "background": "0 0% 100%",
    "foreground": "222 47% 11%",
    "muted": "210 40% 96%",
    "destructive": "0 84% 60%"
  }'::jsonb,
  typography jsonb NOT NULL DEFAULT '{
    "font_family": "Gilroy",
    "font_size_base": "16px",
    "line_height": "1.5"
  }'::jsonb,
  social_links jsonb DEFAULT '{}'::jsonb,
  contact_email text,
  contact_phone text,
  address jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==============================================
-- SEO SETTINGS TABLE (Default SEO Configuration)
-- ==============================================
CREATE TABLE public.seo_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  default_title text NOT NULL DEFAULT 'SpaceSeller - Immobilienfotografie & Visualisierung',
  default_description text DEFAULT 'Professionelle Immobilienfotografie, Virtual Staging und Bildbearbeitung für Makler und Immobilienunternehmen.',
  default_keywords text[] DEFAULT ARRAY['Immobilienfotografie', 'Virtual Staging', 'Bildbearbeitung', 'Makler'],
  title_suffix text DEFAULT ' | SpaceSeller',
  open_graph jsonb DEFAULT '{
    "type": "website",
    "locale": "de_DE"
  }'::jsonb,
  twitter_card jsonb DEFAULT '{
    "card": "summary_large_image"
  }'::jsonb,
  robots_txt text DEFAULT 'User-agent: *
Disallow: /admin-backend/
Disallow: /dashboard/
Disallow: /my-orders/
Disallow: /settings/
Allow: /

Sitemap: https://spaceseller.de/sitemap.xml',
  canonical_domain text DEFAULT 'https://spaceseller.de',
  structured_data jsonb DEFAULT '{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SpaceSeller"
  }'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==============================================
-- PAGE SEO TABLE (Page-specific SEO)
-- ==============================================
CREATE TABLE public.page_seo (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path text NOT NULL UNIQUE,
  page_name text NOT NULL,
  title text,
  description text,
  keywords text[],
  og_image text,
  structured_data jsonb,
  no_index boolean DEFAULT false,
  no_follow boolean DEFAULT false,
  canonical_url text,
  priority numeric DEFAULT 0.5,
  change_frequency text DEFAULT 'monthly',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==============================================
-- SEA SETTINGS TABLE (Tracking & Advertising)
-- ==============================================
CREATE TABLE public.sea_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  google_analytics_id text,
  google_tag_manager_id text,
  google_ads_id text,
  google_ads_conversion_label text,
  facebook_pixel_id text,
  linkedin_insight_tag text,
  hotjar_id text,
  conversion_events jsonb DEFAULT '{
    "order_completed": true,
    "signup_completed": true,
    "contact_form_submitted": true
  }'::jsonb,
  cookie_consent_required boolean DEFAULT true,
  enabled boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==============================================
-- RLS POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sea_settings ENABLE ROW LEVEL SECURITY;

-- site_settings policies
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can modify site settings" 
ON public.site_settings FOR ALL USING (is_admin(auth.uid()));

-- seo_settings policies
CREATE POLICY "SEO settings are viewable by everyone" 
ON public.seo_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can modify SEO settings" 
ON public.seo_settings FOR ALL USING (is_admin(auth.uid()));

-- page_seo policies
CREATE POLICY "Page SEO is viewable by everyone" 
ON public.page_seo FOR SELECT USING (true);

CREATE POLICY "Only admins can modify page SEO" 
ON public.page_seo FOR ALL USING (is_admin(auth.uid()));

-- sea_settings policies
CREATE POLICY "SEA settings are viewable by everyone" 
ON public.sea_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can modify SEA settings" 
ON public.sea_settings FOR ALL USING (is_admin(auth.uid()));

-- ==============================================
-- UPDATED_AT TRIGGERS
-- ==============================================

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_page_seo_updated_at
  BEFORE UPDATE ON public.page_seo
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sea_settings_updated_at
  BEFORE UPDATE ON public.sea_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================
-- INSERT DEFAULT DATA
-- ==============================================

-- Insert default site settings
INSERT INTO public.site_settings (site_name, site_description) 
VALUES ('SpaceSeller', 'Professionelle Immobilienfotografie und Visualisierung');

-- Insert default SEO settings
INSERT INTO public.seo_settings (default_title) 
VALUES ('SpaceSeller - Immobilienfotografie & Visualisierung');

-- Insert default SEA settings
INSERT INTO public.sea_settings (enabled) 
VALUES (false);

-- Insert default page SEO entries
INSERT INTO public.page_seo (page_path, page_name, title, description) VALUES
('/', 'Startseite', 'SpaceSeller - Professionelle Immobilienfotografie', 'Hochwertige Immobilienfotos, Virtual Staging und Bildbearbeitung für Makler und Immobilienunternehmen.'),
('/order', 'Bestellung', 'Jetzt bestellen | SpaceSeller', 'Bestellen Sie professionelle Immobilienfotografie und Bildbearbeitung.'),
('/auth', 'Anmeldung', 'Anmelden | SpaceSeller', 'Melden Sie sich bei Ihrem SpaceSeller Konto an.'),
('/datenschutz', 'Datenschutz', 'Datenschutzerklärung | SpaceSeller', 'Informationen zum Datenschutz bei SpaceSeller.'),
('/impressum', 'Impressum', 'Impressum | SpaceSeller', 'Impressum und rechtliche Informationen.'),
('/agb', 'AGB', 'Allgemeine Geschäftsbedingungen | SpaceSeller', 'Unsere allgemeinen Geschäftsbedingungen.');