-- Add function to calculate response deadline based on scheduled date
CREATE OR REPLACE FUNCTION calculate_assignment_deadline(
  assigned_at_param timestamptz,
  scheduled_date_param date
)
RETURNS timestamptz
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  hours_to_add integer;
  time_until_shoot interval;
BEGIN
  -- If no scheduled date, default to 12 hours
  IF scheduled_date_param IS NULL THEN
    RETURN assigned_at_param + interval '12 hours';
  END IF;
  
  -- Calculate time between assignment and scheduled date
  time_until_shoot := (scheduled_date_param::timestamptz - assigned_at_param);
  
  -- Determine response window based on how soon the shoot is
  IF time_until_shoot <= interval '24 hours' THEN
    hours_to_add := 4;
  ELSIF time_until_shoot <= interval '48 hours' THEN
    hours_to_add := 6;
  ELSE
    hours_to_add := 12;
  END IF;
  
  RETURN assigned_at_param + (hours_to_add || ' hours')::interval;
END;
$$;

-- Add function to auto-decline expired pending assignments
CREATE OR REPLACE FUNCTION auto_decline_expired_assignments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update assignments where:
  -- 1. Status is still pending
  -- 2. Response deadline has passed
  UPDATE order_assignments
  SET 
    status = 'declined',
    photographer_notes = 'Nicht rechtzeitig beantwortet',
    responded_at = now(),
    updated_at = now()
  WHERE 
    status = 'pending'
    AND calculate_assignment_deadline(assigned_at, scheduled_date) < now();
    
  -- Log the number of auto-declined assignments
  RAISE NOTICE 'Auto-declined % expired assignments', 
    (SELECT COUNT(*) FROM order_assignments 
     WHERE status = 'declined' 
     AND photographer_notes = 'Nicht rechtzeitig beantwortet'
     AND updated_at > now() - interval '1 minute');
END;
$$;

-- Create scheduled job to run auto-decline check every 15 minutes
SELECT cron.schedule(
  'auto-decline-expired-assignments',
  '*/15 * * * *', -- Every 15 minutes
  $$SELECT auto_decline_expired_assignments()$$
);

COMMENT ON FUNCTION calculate_assignment_deadline IS 'Calculates the response deadline for an assignment based on how soon it is scheduled: 4h for <24h, 6h for <48h, 12h otherwise';
COMMENT ON FUNCTION auto_decline_expired_assignments IS 'Automatically declines pending assignments that have passed their response deadline';