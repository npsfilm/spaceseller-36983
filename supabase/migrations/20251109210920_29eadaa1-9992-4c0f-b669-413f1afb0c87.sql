-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'photographer', 'editor');

-- 2. Create user_roles table (separate from profiles for security!)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- 6. RLS Policies for user_roles table
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 7. Add admin access to orders table
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 8. Add admin access to order_items table
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all order items"
ON public.order_items
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 9. Add admin access to order_uploads table
CREATE POLICY "Admins can view all uploads"
ON public.order_uploads
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 10. Add admin access to order_deliverables table
CREATE POLICY "Admins can insert deliverables"
ON public.order_deliverables
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all deliverables"
ON public.order_deliverables
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update deliverables"
ON public.order_deliverables
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 11. Storage bucket policies for admins
CREATE POLICY "Admins can upload deliverables"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-deliverables' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can read all uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id IN ('order-uploads', 'order-deliverables')
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update deliverables in storage"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'order-deliverables'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete deliverables in storage"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-deliverables'
  AND public.is_admin(auth.uid())
);