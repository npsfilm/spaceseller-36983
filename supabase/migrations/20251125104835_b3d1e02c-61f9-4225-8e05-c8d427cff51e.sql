-- Fix payment_amount and travel_cost columns to always use 2 decimal places
ALTER TABLE order_assignments 
  ALTER COLUMN payment_amount TYPE numeric(10, 2),
  ALTER COLUMN travel_cost TYPE numeric(10, 2);