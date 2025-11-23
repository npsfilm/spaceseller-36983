import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.79.0';
import { exportUserDataSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const validatedData = exportUserDataSchema.parse(body);

    // Verify user is requesting their own data
    if (validatedData.userId !== user.id) {
      throw new Error('Unauthorized: Can only export your own data');
    }

    // Fetch user orders first
    const ordersResult = await supabase
      .from('orders')
      .select('*, order_items(*), order_upgrades(*)')
      .eq('user_id', user.id);

    const orderIds = ordersResult.data?.map((o: { id: string }) => o.id) || [];

    // Fetch all other user data
    const [profileData, addressesData, uploadsData, deliverablesData, consentsData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('addresses').select('*').eq('user_id', user.id),
      supabase.from('order_uploads').select('*').eq('user_id', user.id),
      orderIds.length > 0 
        ? supabase.from('order_deliverables').select('*').in('order_id', orderIds)
        : Promise.resolve({ data: [], error: null }),
      supabase.from('user_consents').select('*').eq('user_id', user.id)
    ]);

    const userData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at
      },
      profile: profileData.data,
      orders: ordersResult.data || [],
      addresses: addressesData.data || [],
      uploads: uploadsData.data || [],
      deliverables: deliverablesData.data || [],
      consents: consentsData.data || []
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: userData,
        message: 'User data exported successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        status: errorMessage.includes('Unauthorized') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
