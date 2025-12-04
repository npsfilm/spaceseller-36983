-- Create page_tracking table for admin page overview
CREATE TABLE public.page_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_handle text NOT NULL UNIQUE,
  title text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('admin', 'client', 'photographer', 'public')),
  page_created boolean DEFAULT false,
  text_finalized boolean DEFAULT false,
  pictures_finalized boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_tracking ENABLE ROW LEVEL SECURITY;

-- Admin-only access policy
CREATE POLICY "Admins can manage page tracking"
  ON public.page_tracking FOR ALL
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_page_tracking_updated_at
  BEFORE UPDATE ON public.page_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();