-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to cleanup old rate limit logs
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.rate_limit_logs
  WHERE created_at < NOW() - INTERVAL '24 hours';
$$;

-- Schedule cleanup job for expired password reset tokens (runs every hour)
SELECT cron.schedule(
  'cleanup-expired-tokens',
  '0 * * * *',
  $$SELECT public.cleanup_expired_reset_tokens()$$
);

-- Schedule rate limit cleanup to run daily at 3am
SELECT cron.schedule(
  'cleanup-old-rate-limits',
  '0 3 * * *',
  $$SELECT public.cleanup_old_rate_limits()$$
);

-- Create sequence for atomic order number generation
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Replace the vulnerable generate_order_number function with sequence-based approach
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  year_part text;
  sequence_part integer;
  new_number text;
  current_year integer;
  last_order_year integer;
BEGIN
  year_part := to_char(now(), 'YYYY');
  current_year := EXTRACT(YEAR FROM now())::integer;
  
  -- Check if we need to reset the sequence for a new year
  SELECT EXTRACT(YEAR FROM created_at)::integer INTO last_order_year
  FROM public.orders
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Reset sequence if it's a new year or no orders exist yet
  IF last_order_year IS NULL OR last_order_year < current_year THEN
    ALTER SEQUENCE order_number_seq RESTART WITH 1;
  END IF;
  
  -- Get next sequence value atomically (prevents race conditions)
  sequence_part := nextval('order_number_seq');
  
  -- Format: SS-YYYY-NNNN
  new_number := 'SS-' || year_part || '-' || LPAD(sequence_part::text, 4, '0');
  
  RETURN new_number;
END;
$$;