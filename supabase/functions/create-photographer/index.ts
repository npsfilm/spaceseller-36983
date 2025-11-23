import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePhotographerRequest {
  email: string;
  vorname: string;
  nachname: string;
  telefon?: string;
  strasse?: string;
  plz?: string;
  stadt?: string;
  land?: string;
  service_radius_km?: number;
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
    const photographerData: CreatePhotographerRequest = await req.json();

    // Validate required fields
    if (!photographerData.email || !photographerData.vorname || !photographerData.nachname) {
      return new Response(
        JSON.stringify({ error: 'Email, Vorname und Nachname sind erforderlich' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a random temporary password
    const tempPassword = crypto.randomUUID();

    // Create the auth user using admin client
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: photographerData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        vorname: photographerData.vorname,
        nachname: photographerData.nachname
      }
    });

    if (createUserError || !newUser.user) {
      return new Response(
        JSON.stringify({ 
          error: createUserError?.message || 'Failed to create user account'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update the profile record (created by trigger) with additional details
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        vorname: photographerData.vorname,
        nachname: photographerData.nachname,
        telefon: photographerData.telefon || null,
        strasse: photographerData.strasse || null,
        plz: photographerData.plz || null,
        stadt: photographerData.stadt || null,
        land: photographerData.land || 'Deutschland',
        service_radius_km: photographerData.service_radius_km || 50,
        onboarding_completed: true
      })
      .eq('id', newUser.user.id);

    if (profileError) {
      // Rollback: delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: 'Failed to update user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Assign photographer role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'photographer',
        created_by: user.id
      });

    if (roleError) {
      // Continue anyway - admin can fix this manually
    }

    // Send password reset email
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: photographerData.email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`
      }
    });

    if (resetError) {
      // Continue anyway - admin can resend manually
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: newUser.user.id,
        message: 'Fotograf erfolgreich erstellt. Eine E-Mail zum Festlegen des Passworts wurde versendet.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
