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
      throw new Error('No authorization header');
    }

    // Create regular client to verify user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verify the calling user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[create-photographer] User verification failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is an admin
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
      _user_id: user.id
    });

    if (adminError || !isAdmin) {
      console.error('[create-photographer] Admin check failed:', adminError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const photographerData: CreatePhotographerRequest = await req.json();
    console.log('[create-photographer] Creating photographer with email:', photographerData.email);

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
      console.error('[create-photographer] Failed to create user:', createUserError);
      return new Response(
        JSON.stringify({ 
          error: createUserError?.message || 'Failed to create user account'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[create-photographer] User created successfully:', newUser.user.id);

    // Create profile record
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: photographerData.email,
        vorname: photographerData.vorname,
        nachname: photographerData.nachname,
        telefon: photographerData.telefon || null,
        strasse: photographerData.strasse || null,
        plz: photographerData.plz || null,
        stadt: photographerData.stadt || null,
        land: photographerData.land || 'Deutschland',
        service_radius_km: photographerData.service_radius_km || 50,
        onboarding_completed: true
      });

    if (profileError) {
      console.error('[create-photographer] Failed to create profile:', profileError);
      // Rollback: delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[create-photographer] Profile created successfully');

    // Assign photographer role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'photographer',
        created_by: user.id
      });

    if (roleError) {
      console.error('[create-photographer] Failed to assign photographer role:', roleError);
      // Continue anyway - admin can fix this manually
    } else {
      console.log('[create-photographer] Photographer role assigned successfully');
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
      console.error('[create-photographer] Failed to send password reset email:', resetError);
      // Continue anyway - admin can resend manually
    } else {
      console.log('[create-photographer] Password reset email sent successfully');
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
    console.error('[create-photographer] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
