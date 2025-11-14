-- Trigger types regeneration
-- This comment migration will force the Supabase types to regenerate
-- The order_assignments, notifications tables and is_photographer function should be properly typed

-- Verify all tables exist (no-op query)
DO $$ 
BEGIN 
  RAISE NOTICE 'Types regeneration trigger';
END $$;