-- Create table for rate limiting tracking
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_rate_limit_logs_ip_endpoint_window 
ON public.rate_limit_logs(ip_address, endpoint, window_start DESC);

-- Enable RLS
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Block all direct access - service role only
CREATE POLICY "Block all direct access - service role only"
ON public.rate_limit_logs
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- Function to check rate limit (returns true if rate limit exceeded)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _ip_address TEXT,
  _endpoint TEXT,
  _max_requests INTEGER DEFAULT 5,
  _window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _window_start TIMESTAMP WITH TIME ZONE;
  _request_count INTEGER;
BEGIN
  _window_start := NOW() - (_window_minutes || ' minutes')::INTERVAL;
  
  -- Get total requests in current window
  SELECT COALESCE(SUM(request_count), 0)
  INTO _request_count
  FROM public.rate_limit_logs
  WHERE ip_address = _ip_address
    AND endpoint = _endpoint
    AND window_start >= _window_start;
  
  -- If exceeded, return true
  IF _request_count >= _max_requests THEN
    RETURN true;
  END IF;
  
  -- Log this request
  INSERT INTO public.rate_limit_logs (ip_address, endpoint, request_count, window_start)
  VALUES (_ip_address, _endpoint, 1, NOW())
  ON CONFLICT DO NOTHING;
  
  RETURN false;
END;
$$;

-- Function to cleanup old rate limit logs (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limit_logs
  WHERE created_at < NOW() - INTERVAL '24 hours';
$$;

COMMENT ON TABLE public.rate_limit_logs IS 'Tracks API request rates for rate limiting (IP-based)';
COMMENT ON FUNCTION public.check_rate_limit IS 'Returns true if rate limit exceeded, false otherwise. Automatically logs the request.';
COMMENT ON FUNCTION public.cleanup_old_rate_limits IS 'Deletes rate limit logs older than 24 hours. Should be called periodically by admins.';