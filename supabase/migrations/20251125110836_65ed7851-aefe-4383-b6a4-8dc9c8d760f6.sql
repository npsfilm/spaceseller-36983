-- Add unanswered_count field to track how many times assignments go unanswered
ALTER TABLE orders 
ADD COLUMN unanswered_assignment_count INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN orders.unanswered_assignment_count IS 'Tracks how many times photographer assignments for this order were not answered within deadline';

-- Update auto_decline function to increment unanswered count
CREATE OR REPLACE FUNCTION auto_decline_expired_assignments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update assignments where:
  -- 1. Status is still pending
  -- 2. Response deadline has passed
  WITH declined_assignments AS (
    UPDATE order_assignments
    SET 
      status = 'declined',
      photographer_notes = 'Nicht rechtzeitig beantwortet',
      responded_at = now(),
      updated_at = now()
    WHERE 
      status = 'pending'
      AND calculate_assignment_deadline(assigned_at, scheduled_date) < now()
    RETURNING order_id
  )
  -- Increment unanswered count for affected orders
  UPDATE orders
  SET unanswered_assignment_count = unanswered_assignment_count + 1
  WHERE id IN (SELECT order_id FROM declined_assignments);
    
  -- Log the number of auto-declined assignments
  RAISE NOTICE 'Auto-declined % expired assignments', 
    (SELECT COUNT(*) FROM order_assignments 
     WHERE status = 'declined' 
     AND photographer_notes = 'Nicht rechtzeitig beantwortet'
     AND updated_at > now() - interval '1 minute');
END;
$$;

-- Update notification trigger to include unanswered count info
CREATE OR REPLACE FUNCTION notify_admin_on_auto_decline()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_user_id uuid;
  order_num text;
  unanswered_count integer;
BEGIN
  -- Only proceed if this is an auto-decline
  IF NEW.status = 'declined' AND 
     NEW.photographer_notes = 'Nicht rechtzeitig beantwortet' AND
     OLD.status = 'pending' THEN
    
    -- Get the order number and unanswered count
    SELECT order_number, unanswered_assignment_count 
    INTO order_num, unanswered_count
    FROM orders
    WHERE id = NEW.order_id;
    
    -- Notify all admins
    FOR admin_user_id IN
      SELECT user_id FROM user_roles WHERE role = 'admin'
    LOOP
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        admin_user_id,
        'assignment_auto_declined',
        'Auftrag automatisch abgelehnt',
        'Fotograf hat nicht rechtzeitig auf Auftrag #' || order_num || ' geantwortet. ' ||
        'Dies ist das ' || unanswered_count || '. Mal, dass dieser Auftrag nicht beantwortet wurde.',
        '/admin-backend?highlight=' || NEW.order_id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;