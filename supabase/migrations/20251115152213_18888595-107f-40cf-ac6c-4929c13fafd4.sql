-- Add policy to allow users to view their own roles
-- This fixes the circular dependency issue where is_admin() couldn't check roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add comment explaining the security model
COMMENT ON POLICY "Users can view their own roles" ON public.user_roles IS 
'Allows users to check their own roles. Combined with SECURITY DEFINER functions, this enables role checking without circular dependencies.';