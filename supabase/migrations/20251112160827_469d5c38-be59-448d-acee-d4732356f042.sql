-- Drop the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Service role can manage password reset tokens" ON public.password_reset_tokens;

-- Create a restrictive policy that blocks all regular user access
-- Service role will still work because it bypasses RLS entirely
CREATE POLICY "Block all direct access - service role only"
ON public.password_reset_tokens
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Add a comment explaining why this policy exists
COMMENT ON POLICY "Block all direct access - service role only" ON public.password_reset_tokens IS 
'Blocks all direct user access to password reset tokens. Only edge functions using service role key can access this table (service role bypasses RLS).';
