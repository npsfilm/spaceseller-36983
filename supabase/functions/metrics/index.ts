import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetricsResult {
  timestamp: string;
  orders: {
    active: number;
    todaySubmissions: number;
    avgProcessingTime: number | null;
  };
  storage: {
    uploadsCount: number;
    deliverablesCount: number;
  };
  users: {
    totalProfiles: number;
    photographersCount: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { _user_id: user.id });
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const metrics: MetricsResult = {
      timestamp: new Date().toISOString(),
      orders: {
        active: 0,
        todaySubmissions: 0,
        avgProcessingTime: null,
      },
      storage: {
        uploadsCount: 0,
        deliverablesCount: 0,
      },
      users: {
        totalProfiles: 0,
        photographersCount: 0,
      },
    };

    // Get active orders count
    const { count: activeOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'in_progress']);
    metrics.orders.active = activeOrders ?? 0;

    // Get today's submissions
    const today = new Date().toISOString().split('T')[0];
    const { count: todayOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)
      .eq('status', 'submitted');
    metrics.orders.todaySubmissions = todayOrders ?? 0;

    // Get storage metrics
    const { count: uploadsCount } = await supabase
      .from('order_uploads')
      .select('*', { count: 'exact', head: true });
    metrics.storage.uploadsCount = uploadsCount ?? 0;

    const { count: deliverablesCount } = await supabase
      .from('order_deliverables')
      .select('*', { count: 'exact', head: true });
    metrics.storage.deliverablesCount = deliverablesCount ?? 0;

    // Get user metrics
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    metrics.users.totalProfiles = profilesCount ?? 0;

    const { count: photographersCount } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'photographer');
    metrics.users.photographersCount = photographersCount ?? 0;

    return new Response(
      JSON.stringify(metrics),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
