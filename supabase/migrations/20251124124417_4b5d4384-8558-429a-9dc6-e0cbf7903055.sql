-- Migrate photography packages to services table
INSERT INTO public.services (name, description, category, base_price, unit, features, is_active)
VALUES
  -- Photo Packages
  ('Basic S', 'Immobilienshooting - 6 Fotos', 'photography', 199, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Lieferung innerhalb 48h", "Online-Galerie"]'::jsonb, true),
  ('Basic M', 'Immobilienshooting - 8 Fotos', 'photography', 249, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Lieferung innerhalb 48h", "Online-Galerie"]'::jsonb, true),
  ('Standard', 'Immobilienshooting - 10 Fotos', 'photography', 299, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Lieferung innerhalb 48h", "Online-Galerie"]'::jsonb, true),
  ('Premium S', 'Immobilienshooting - 15 Fotos', 'photography', 399, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Express-Lieferung 24h", "Online-Galerie"]'::jsonb, true),
  ('Premium M', 'Immobilienshooting - 20 Fotos', 'photography', 499, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Express-Lieferung 24h", "Color Grading", "Online-Galerie"]'::jsonb, true),
  ('Premium L', 'Immobilienshooting - 25 Fotos', 'photography', 589, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Express-Lieferung 24h", "Color Grading", "Online-Galerie"]'::jsonb, true),
  ('Deluxe S', 'Immobilienshooting - 40 Fotos', 'photography', 799, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Express-Lieferung 24h", "Color Grading", "Raw-Dateien", "Online-Galerie"]'::jsonb, true),
  ('Deluxe M', 'Immobilienshooting - 50 Fotos', 'photography', 949, 'per_shoot', '["Professionelle Bildbearbeitung", "HDR-Optimierung", "Express-Lieferung 24h", "Color Grading", "Raw-Dateien", "Online-Galerie"]'::jsonb, true),
  
  -- Drone Packages
  ('Sky S', 'Drohnenshooting - 5 Fotos', 'photography', 219, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "Online-Galerie"]'::jsonb, true),
  ('Sky M', 'Drohnenshooting - 8 Fotos', 'photography', 249, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "Online-Galerie"]'::jsonb, true),
  ('Sky L', 'Drohnenshooting - 10 Fotos', 'photography', 279, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "Online-Galerie"]'::jsonb, true),
  ('Sky XL S', 'Drohnenshooting - 12 Fotos', 'photography', 319, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "Online-Galerie"]'::jsonb, true),
  ('Sky XL M', 'Drohnenshooting - 15 Fotos', 'photography', 379, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "360° Panorama", "Online-Galerie"]'::jsonb, true),
  ('Sky XL L', 'Drohnenshooting - 20 Fotos', 'photography', 499, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "360° Panorama", "Online-Galerie"]'::jsonb, true),
  ('Sky Premium S', 'Drohnenshooting - 25 Fotos', 'photography', 589, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "360° Panorama", "Raw-Dateien", "Online-Galerie"]'::jsonb, true),
  ('Sky Premium M', 'Drohnenshooting - 30 Fotos', 'photography', 679, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "360° Panorama", "Raw-Dateien", "Online-Galerie"]'::jsonb, true),
  ('Sky Premium L', 'Drohnenshooting - 40 Fotos', 'photography', 849, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "360° Panorama", "Raw-Dateien", "Online-Galerie"]'::jsonb, true),
  ('Sky Premium XL', 'Drohnenshooting - 50 Fotos', 'photography', 999, 'per_shoot', '["Luftaufnahmen in 4K", "Professionelle Bildbearbeitung", "HDR-Optimierung", "360° Panorama", "Raw-Dateien", "Online-Galerie"]'::jsonb, true),
  
  -- Kombi Packages
  ('Kombi S', 'Foto + Drohne - 12 Fotos (8 Immo + 4 Drohne)', 'photography', 379, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true),
  ('Kombi M', 'Foto + Drohne - 15 Fotos (10 Immo + 5 Drohne)', 'photography', 449, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true),
  ('Kombi L', 'Foto + Drohne - 20 Fotos (15 Immo + 5 Drohne)', 'photography', 549, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true),
  ('Kombi XL S', 'Foto + Drohne - 25 Fotos (20 Immo + 5 Drohne)', 'photography', 649, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Express 24h", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true),
  ('Kombi XL M', 'Foto + Drohne - 30 Fotos (20 Immo + 10 Drohne)', 'photography', 699, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Express 24h", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true),
  ('Kombi XL L', 'Foto + Drohne - 40 Fotos (30 Immo + 10 Drohne)', 'photography', 849, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Express 24h", "Color Grading", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true),
  ('Kombi Premium', 'Foto + Drohne - 50 Fotos (40 Immo + 10 Drohne)', 'photography', 999, 'per_shoot', '["Foto & Drohne kombiniert", "Professionelle Bildbearbeitung beider", "HDR-Optimierung", "Express 24h", "Color Grading", "Raw-Dateien", "Online-Galerie", "Kombi-Rabatt inkl."]'::jsonb, true);

-- Migrate photography add-ons to upgrades table
INSERT INTO public.upgrades (name, description, category, base_price, unit, pricing_type, pricing_config, is_active)
VALUES
  ('Drohnenaufnahmen', '5 Luftaufnahmen Ihrer Immobilie', 'photography', 89, 'fixed', 'fixed', '{}'::jsonb, true),
  ('Video-Tour', '2-3 Minuten professionelles Immobilienvideo', 'photography', 249, 'fixed', 'fixed', '{}'::jsonb, true),
  ('Twilight-Shooting', '5 zusätzliche Dämmerungsaufnahmen', 'photography', 129, 'fixed', 'fixed', '{}'::jsonb, true);