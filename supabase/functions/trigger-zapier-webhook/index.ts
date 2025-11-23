import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Request validation schema
const triggerZapierWebhookSchema = z.object({
  assignmentData: z.object({
    order_id: z.string().uuid('Ungültige Order ID'),
    photographer_id: z.string().uuid('Ungültige Photographer ID'),
    assignment_id: z.string().uuid('Ungültige Assignment ID'),
    scheduled_date: z.string().optional(),
    scheduled_time: z.string().optional()
  }).catchall(z.unknown())
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate request body
    const validation = triggerZapierWebhookSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Validierungsfehler',
          details: validation.error.errors.map(e => e.message).join(', ')
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { assignmentData } = validation.data;
    const webhookUrl = Deno.env.get('ZAPIER_PHOTOGRAPHER_WEBHOOK_URL');
    
    if (!webhookUrl) {
      return new Response(
        JSON.stringify({ success: false, message: 'Webhook not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Send to Zapier
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });

    return new Response(
      JSON.stringify({ success: true, status: response.status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
