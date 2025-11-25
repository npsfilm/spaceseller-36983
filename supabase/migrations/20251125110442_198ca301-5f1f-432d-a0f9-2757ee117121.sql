-- Add trigger to notify admins when assignments are auto-declined
CREATE OR REPLACE FUNCTION notify_admin_on_auto_decline()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid;
  order_num text;
BEGIN
  -- Only proceed if this is an auto-decline
  IF NEW.status = 'declined' AND 
     NEW.photographer_notes = 'Nicht rechtzeitig beantwortet' AND
     OLD.status = 'pending' THEN
    
    -- Get the order number
    SELECT order_number INTO order_num
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
        'Fotograf hat nicht rechtzeitig auf Auftrag #' || order_num || ' geantwortet.',
        '/admin-backend/orders?highlight=' || NEW.order_id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_admin_on_auto_decline
  AFTER UPDATE ON order_assignments
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_auto_decline();

COMMENT ON FUNCTION notify_admin_on_auto_decline IS 'Notifies all admins when an assignment is automatically declined due to timeout';