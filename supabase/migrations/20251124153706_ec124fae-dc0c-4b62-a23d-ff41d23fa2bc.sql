-- Allow photographers to view orders for their assignments
CREATE POLICY "Photographers can view assigned orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM order_assignments
    WHERE order_assignments.order_id = orders.id
    AND order_assignments.photographer_id = auth.uid()
  )
);

-- Allow photographers to view addresses for their assigned orders
CREATE POLICY "Photographers can view addresses for assigned orders"
ON addresses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM order_assignments
    WHERE order_assignments.order_id = addresses.order_id
    AND order_assignments.photographer_id = auth.uid()
  )
);

-- Allow photographers to view order items for their assigned orders
CREATE POLICY "Photographers can view order items for assigned orders"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM order_assignments
    WHERE order_assignments.order_id = order_items.order_id
    AND order_assignments.photographer_id = auth.uid()
  )
);

-- Allow photographers to view customer profiles for their assigned orders
CREATE POLICY "Photographers can view customer profiles for assigned orders"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    INNER JOIN order_assignments ON order_assignments.order_id = orders.id
    WHERE orders.user_id = profiles.id
    AND order_assignments.photographer_id = auth.uid()
  )
);