-- Add requested shooting date fields to orders table
ALTER TABLE public.orders
ADD COLUMN requested_date DATE,
ADD COLUMN requested_time TIME,
ADD COLUMN alternative_date DATE,
ADD COLUMN alternative_time TIME;

COMMENT ON COLUMN public.orders.requested_date IS 'Primary shooting date requested by client';
COMMENT ON COLUMN public.orders.requested_time IS 'Primary shooting time requested by client';
COMMENT ON COLUMN public.orders.alternative_date IS 'Alternative shooting date requested by client';
COMMENT ON COLUMN public.orders.alternative_time IS 'Alternative shooting time requested by client';