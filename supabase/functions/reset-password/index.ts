import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Logger } from '../_shared/logger.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  token: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract IP address for rate limiting
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check rate limit: 5 requests per 15 minutes per IP
    const { data: isRateLimited, error: rateLimitError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        _ip_address: ipAddress,
        _endpoint: 'reset-password',
        _max_requests: 5,
        _window_minutes: 15
      }
    );

    if (rateLimitError) {
      // Continue anyway - don't block on rate limit errors
    }

    if (isRateLimited === true) {
      return new Response(
        JSON.stringify({ 
          error: "Too many password reset attempts. Please try again in 15 minutes." 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": "900", // 15 minutes in seconds
            ...corsHeaders 
          },
        }
      );
    }

    const { token, newPassword }: RequestBody = await req.json();

    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Token and new password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Comprehensive password validation
    const passwordErrors: string[] = [];
    
    if (newPassword.length < 8) {
      passwordErrors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(newPassword)) {
      passwordErrors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(newPassword)) {
      passwordErrors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(newPassword)) {
      passwordErrors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      passwordErrors.push("Password must contain at least one special character");
    }

    // Block common weak passwords
    const commonPasswords = [
      "password", "password123", "12345678", "qwerty", "abc123", 
      "password1", "admin123", "letmein", "welcome", "monkey",
      "dragon", "master", "sunshine", "iloveyou", "princess"
    ];
    if (commonPasswords.some(common => newPassword.toLowerCase().includes(common))) {
      passwordErrors.push("Password is too common and easily guessable");
    }

    if (passwordErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "Password does not meet security requirements", 
          details: passwordErrors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Find the token in the database (supabaseAdmin already created above for rate limiting)
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired reset token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ error: "Reset token has expired. Please request a new one." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update user's password using Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      throw new Error("Failed to update password");
    }
    
    Logger.security('Password successfully reset', { 
      action: 'password_reset_success', 
      userId: tokenData.user_id,
      ipAddress 
    });

    // Mark token as used
    const { error: markUsedError } = await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("id", tokenData.id);

    if (markUsedError) {
      // Don't fail the request since password was updated successfully
    }

    return new Response(
      JSON.stringify({ message: "Password has been reset successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "An error occurred while resetting your password" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
