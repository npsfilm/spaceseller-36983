-- Add tax, banking, and professional information fields for photographers
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS umsatzsteuer_pflichtig boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS umsatzsteuer_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS steuernummer text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kleinunternehmer boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rechtsform text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS handelsregister_nr text;

-- Banking Information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iban text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bic text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kontoinhaber text;

-- Professional Information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS berufshaftpflicht_bis date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS equipment text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url text;

COMMENT ON COLUMN profiles.umsatzsteuer_pflichtig IS 'Whether photographer is VAT liable';
COMMENT ON COLUMN profiles.umsatzsteuer_id IS 'German VAT ID (USt-IdNr.)';
COMMENT ON COLUMN profiles.steuernummer IS 'German tax number (Steuernummer)';
COMMENT ON COLUMN profiles.kleinunternehmer IS 'Small business regulation §19 UStG';
COMMENT ON COLUMN profiles.rechtsform IS 'Legal form (Einzelunternehmen, GbR, UG, GmbH, Freiberufler)';
COMMENT ON COLUMN profiles.berufshaftpflicht_bis IS 'Professional liability insurance valid until';
COMMENT ON COLUMN profiles.equipment IS 'Photography equipment details';
COMMENT ON COLUMN profiles.portfolio_url IS 'Link to portfolio/website';