-- Add profile completeness tracking column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;

-- Create function to check if photographer profile is complete
CREATE OR REPLACE FUNCTION check_photographer_profile_complete(profile_row profiles)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  is_complete BOOLEAN;
BEGIN
  -- Check all required fields
  is_complete := (
    profile_row.vorname IS NOT NULL AND profile_row.vorname != '' AND
    profile_row.nachname IS NOT NULL AND profile_row.nachname != '' AND
    profile_row.telefon IS NOT NULL AND profile_row.telefon != '' AND
    profile_row.strasse IS NOT NULL AND profile_row.strasse != '' AND
    profile_row.plz IS NOT NULL AND profile_row.plz != '' AND
    profile_row.stadt IS NOT NULL AND profile_row.stadt != '' AND
    profile_row.iban IS NOT NULL AND profile_row.iban != '' AND
    profile_row.kontoinhaber IS NOT NULL AND profile_row.kontoinhaber != '' AND
    -- Tax status: either Kleinunternehmer OR (VAT liable with tax number)
    (
      profile_row.kleinunternehmer = true OR
      (
        profile_row.umsatzsteuer_pflichtig = true AND
        (
          (profile_row.steuernummer IS NOT NULL AND profile_row.steuernummer != '') OR
          (profile_row.umsatzsteuer_id IS NOT NULL AND profile_row.umsatzsteuer_id != '')
        )
      )
    )
  );
  
  RETURN is_complete;
END;
$$;

-- Create trigger function to auto-update profile_complete
CREATE OR REPLACE FUNCTION update_profile_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_photographer BOOLEAN;
BEGIN
  -- Check if user is a photographer
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = NEW.id AND role = 'photographer'
  ) INTO is_photographer;
  
  -- Only update for photographers
  IF is_photographer THEN
    NEW.profile_complete := check_photographer_profile_complete(NEW);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_update_profile_complete ON profiles;
CREATE TRIGGER trigger_update_profile_complete
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_complete();

-- Backfill existing photographer profiles
UPDATE profiles
SET profile_complete = check_photographer_profile_complete(profiles.*)
WHERE id IN (
  SELECT user_id FROM user_roles WHERE role = 'photographer'
);

-- Create function to notify admins when profile becomes complete
CREATE OR REPLACE FUNCTION notify_admins_profile_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid;
  photographer_name text;
BEGIN
  -- Only notify if profile just became complete
  IF NEW.profile_complete = true AND (OLD.profile_complete = false OR OLD.profile_complete IS NULL) THEN
    -- Get photographer name
    photographer_name := COALESCE(NEW.vorname || ' ' || NEW.nachname, NEW.email);
    
    -- Notify all admins
    FOR admin_user_id IN
      SELECT user_id FROM user_roles WHERE role = 'admin'
    LOOP
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        admin_user_id,
        'photographer_profile_complete',
        'Fotograf einsatzbereit',
        photographer_name || ' hat das Profil vervollständigt und ist jetzt einsatzbereit.',
        '/admin-backend/photographer-management'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for admin notifications
DROP TRIGGER IF EXISTS trigger_notify_profile_complete ON profiles;
CREATE TRIGGER trigger_notify_profile_complete
  AFTER UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.profile_complete IS DISTINCT FROM OLD.profile_complete)
  EXECUTE FUNCTION notify_admins_profile_complete();