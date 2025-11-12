import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
      console.log("Password validation failed:", passwordErrors);
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

    // Find the token in the database
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single();

    if (tokenError || !tokenData) {
      console.error("Token not found or error:", tokenError);
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
      console.log("Token expired:", token);
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
      console.error("Error updating password:", updateError);
      throw new Error("Failed to update password");
    }

    // Mark token as used
    const { error: markUsedError } = await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used: true })
      .eq("id", tokenData.id);

    if (markUsedError) {
      console.error("Error marking token as used:", markUsedError);
      // Don't fail the request since password was updated successfully
    }

    console.log("Password reset successful for user:", tokenData.user_id);

    return new Response(
      JSON.stringify({ message: "Password has been reset successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-password function:", error);
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
