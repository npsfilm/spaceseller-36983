import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assignmentData } = await req.json();
    const webhookUrl = Deno.env.get('ZAPIER_PHOTOGRAPHER_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.warn('Zapier webhook URL not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Webhook not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('Triggering Zapier webhook with data:', assignmentData);

    // Send to Zapier
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });

    console.log('Zapier webhook response status:', response.status);

    return new Response(
      JSON.stringify({ success: true, status: response.status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error triggering Zapier webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
