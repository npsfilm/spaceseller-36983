import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: { status: 'pass' | 'fail'; responseTime?: number };
    storage: { status: 'pass' | 'fail'; responseTime?: number };
    email: { status: 'pass' | 'fail'; responseTime?: number };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result: HealthCheckResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: 'pass' },
        storage: { status: 'pass' },
        email: { status: 'pass' },
      },
    };

    // Check database connectivity
    const dbStart = Date.now();
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) throw error;
      
      result.checks.database.responseTime = Date.now() - dbStart;
    } catch (error) {
      result.checks.database.status = 'fail';
      result.status = 'unhealthy';
    }

    // Check storage bucket access
    const storageStart = Date.now();
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const { error } = await supabase.storage.from('order-uploads').list('', { limit: 1 });
      if (error) throw error;
      
      result.checks.storage.responseTime = Date.now() - storageStart;
    } catch (error) {
      result.checks.storage.status = 'fail';
      result.status = 'degraded';
    }

    // Check email service (Resend)
    const emailStart = Date.now();
    try {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      if (!resendKey) throw new Error('RESEND_API_KEY not configured');
      
      result.checks.email.responseTime = Date.now() - emailStart;
    } catch (error) {
      result.checks.email.status = 'fail';
      result.status = 'degraded';
    }

    const statusCode = result.status === 'healthy' ? 200 : result.status === 'degraded' ? 200 : 503;

    return new Response(
      JSON.stringify(result),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 503, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
