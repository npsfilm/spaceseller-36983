import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Logger } from '../_shared/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResendPasswordResetRequest {
  photographer_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the JWT token (remove 'Bearer ' prefix)
    const jwt = authHeader.replace('Bearer ', '');

    // Verify the JWT token using admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create regular client to check admin status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verify the user is an admin
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
      _user_id: user.id
    });

    if (adminError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { photographer_id }: ResendPasswordResetRequest = await req.json();

    if (!photographer_id) {
      return new Response(
        JSON.stringify({ error: 'photographer_id ist erforderlich' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get photographer profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email, vorname, nachname')
      .eq('id', photographer_id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Fotograf nicht gefunden' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate custom password reset token
    const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    const { error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: photographer_id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      Logger.error(tokenError, {
        action: 'password_reset_token_failed',
        photographerId: photographer_id
      });
      
      return new Response(
        JSON.stringify({ error: 'Fehler beim Generieren des Passwort-Reset-Links' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create custom reset link
    const resetUrl = `https://app.spaceseller.de/reset-password?token=${token}`;

    // Send webhook to Zapier with reset link and first name
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/24798197/uzc10x7/';
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          vorname: profile.vorname,
          nachname: profile.nachname,
          password_reset_link: resetUrl,
          created_at: new Date().toISOString(),
          is_resend: true
        })
      });
      
      Logger.info('Password reset resent via Zapier webhook', {
        action: 'zapier_webhook_sent',
        photographerId: photographer_id,
        email: profile.email
      });
    } catch (webhookError) {
      Logger.warn('Failed to trigger Zapier webhook', {
        action: 'zapier_webhook_failed',
        error: webhookError instanceof Error ? webhookError.message : 'Unknown error'
      });
      
      return new Response(
        JSON.stringify({ error: 'Fehler beim Senden der Webhook-Benachrichtigung' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Passwort-Reset-Link wurde erfolgreich versendet'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    Logger.error(error, { action: 'resend_password_reset_error' });
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
