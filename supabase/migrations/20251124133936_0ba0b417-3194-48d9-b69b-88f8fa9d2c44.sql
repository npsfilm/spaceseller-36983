-- Add payment and travel cost fields to order_assignments
ALTER TABLE public.order_assignments 
ADD COLUMN payment_amount numeric,
ADD COLUMN travel_cost numeric;