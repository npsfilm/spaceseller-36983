-- Create security monitoring view
-- This view aggregates security-relevant events for admin monitoring

-- Note: Since we can't create a true union view across different tables easily
-- without complex queries, we'll create a simple helper function instead

CREATE OR REPLACE FUNCTION get_recent_security_events(hours_back INTEGER DEFAULT 24)
RETURNS TABLE (
  event_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  ip_address TEXT,
  metadata JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This is a placeholder function that would aggregate security events
  -- In a full implementation, this would combine data from:
  -- - password_reset_tokens
  -- - rate_limit_logs
  -- - order_uploads (for GDPR exports)
  -- - orders (for account deletions)
  
  RETURN QUERY
  SELECT 
    'password_reset'::TEXT as event_type,
    prt.created_at,
    prt.user_id,
    NULL::TEXT as ip_address,
    jsonb_build_object(
      'used', prt.used,
      'expires_at', prt.expires_at
    ) as metadata
  FROM password_reset_tokens prt
  WHERE prt.created_at > NOW() - (hours_back || ' hours')::INTERVAL
  ORDER BY prt.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users (admin check happens in application layer)
GRANT EXECUTE ON FUNCTION get_recent_security_events TO authenticated;

COMMENT ON FUNCTION get_recent_security_events IS 'Retrieves recent security events for monitoring dashboard';
