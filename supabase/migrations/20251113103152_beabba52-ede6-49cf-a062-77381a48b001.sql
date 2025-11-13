-- Add RLS policy to allow admins to view all user profiles
-- This is required for the admin dashboard to display customer information

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));