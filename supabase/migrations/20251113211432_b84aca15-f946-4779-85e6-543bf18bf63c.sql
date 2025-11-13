-- Create order_assignments table for photographer job assignments
CREATE TABLE public.order_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  responded_at TIMESTAMPTZ,
  
  scheduled_date DATE,
  scheduled_time TIME,
  estimated_duration INTERVAL,
  
  admin_notes TEXT,
  photographer_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE (order_id, photographer_id)
);

ALTER TABLE public.order_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_assignments
CREATE POLICY "Admins can manage all assignments"
ON public.order_assignments FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Photographers can view their assignments"
ON public.order_assignments FOR SELECT
TO authenticated
USING (photographer_id = auth.uid());

CREATE POLICY "Photographers can update their assignments"
ON public.order_assignments FOR UPDATE
TO authenticated
USING (photographer_id = auth.uid())
WITH CHECK (photographer_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER handle_order_assignments_updated_at
  BEFORE UPDATE ON public.order_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create notifications table for real-time updates
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create security definer function for photographer role check
CREATE OR REPLACE FUNCTION public.is_photographer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'photographer')
$$;