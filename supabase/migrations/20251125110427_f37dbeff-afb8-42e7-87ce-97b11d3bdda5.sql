-- Fix search_path for security
ALTER FUNCTION calculate_assignment_deadline(timestamptz, date) SET search_path = public;
ALTER FUNCTION auto_decline_expired_assignments() SET search_path = public;