import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Request validation schema
const requestPasswordResetSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(255, 'E-Mail zu lang')
});

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

    // Create Supabase admin client for rate limit check
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
        _endpoint: 'request-password-reset',
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
          error: "Too many password reset requests. Please try again in 15 minutes." 
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

    const body = await req.json();
    
    // Validate request body
    const validation = requestPasswordResetSchema.safeParse(body);
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

    const { email } = validation.data;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if user exists (supabaseAdmin already created above for rate limiting)
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ message: "If an account exists, a password reset email will be sent." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ message: "If an account exists, a password reset email will be sent." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate secure random token
    const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    const { error: insertError } = await supabaseAdmin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      throw new Error("Failed to create password reset token");
    }

    // Create reset link
    const resetUrl = `https://app.spaceseller.de/reset-password?token=${token}`;

    // Send email via Resend
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Passwort zurücksetzen</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
    </style>
    <!--[if mso]>
    <style type="text/css">
        @font-face {
            font-family: 'Gilroy';
            src: url('https://fonts.cdnfonts.com/s/13963/Gilroy-Regular.woff') format('woff');
            font-weight: 400;
            font-style: normal;
            mso-generic-font-family: swiss;
        }
        @font-face {
            font-family: 'Gilroy';
            src: url('https://fonts.cdnfonts.com/s/13963/Gilroy-SemiBold.woff') format('woff');
            font-weight: 600;
            font-style: normal;
            mso-generic-font-family: swiss;
        }
        * {
            font-family: 'Gilroy', Arial, sans-serif !important;
        }
    </style>
    <![endif]-->
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f4f4f4;">
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td>
    <![endif]-->

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 0 10px;">
                <!--[if mso | IE]>
                <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                        <td align="center">
                <![endif]-->

                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                    
                    <tr>
                        <td align="center" style="padding: 40px 20px 30px 20px;">
                            <a href="https://app.spaceseller.de" target="_blank">
                                <img src="https://app.spaceseller.de/spaceseller-logo.png" alt="spaceseller Logo" width="180" style="display: block; width: 180px; max-width: 100%; height: auto; color: #264334;">
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 0 40px 30px 40px; font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333;">
                            <h2 style="margin: 0 0 20px 0; color: #264334; font-size: 24px; font-weight: 600; line-height: 1.3;">
                                Setzen Sie Ihr Passwort zurück
                            </h2>
                            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6; color: #555555;">
                                Wir haben Ihre Anfrage zum Zurücksetzen des Passworts für Ihr spaceseller-Konto erhalten. Um fortzufahren und ein neues Passwort zu erstellen, klicken Sie bitte auf den untenstehenden Button:
                            </p>
                            
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="background-color: #264334; border-radius: 8px;">
                                                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                                        Neues Passwort erstellen
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 10px 40px 20px 40px; font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #777777;">
                                Wenn der Button nicht funktioniert, kopieren Sie bitte den folgenden Link und fügen Sie ihn in die Adresszeile Ihres Browsers ein:
                            </p>
                            <div style="background-color: #f9fafb; border: 1px solid #eeeeee; border-radius: 6px; padding: 12px 15px; word-break: break-all;">
                                <a href="${resetUrl}" target="_blank" style="font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #264334; text-decoration: none;">
                                    ${resetUrl}
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            <hr style="border: 0; height: 1px; background-color: #eeeeee; margin: 0 0 20px 0;">
                            <p style="margin: 0 0 10px 0; font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #777777;">
                                Aus Sicherheitsgründen ist dieser Link nur 60 Minuten gültig.
                            </p>
                            <p style="margin: 0; font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #777777;">
                                Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail einfach ignorieren. Ihr Konto bleibt sicher.
                            </p>
                        </td>
                    </tr>

                </table>

                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                    <tr>
                        <td style="padding: 20px 40px 40px 40px; text-align: center; font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #999999;">
                            <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} spaceseller. Alle Rechte vorbehalten.</p>
                            <p style="margin: 0;">Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht.</p>
                        </td>
                    </tr>
                </table>

                <!--[if mso | IE]>
                        </td>
                    </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>

    <!--[if mso | IE]>
            </td>
        </tr>
    </table>
    <![endif]-->
</body>
</html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "spaceseller <noreply@updates.spaceseller.de>",
      to: [email],
      subject: "Passwort zurücksetzen - spaceseller",
      html,
    });

    if (emailError) {
      throw new Error("Failed to send password reset email");
    }

    return new Response(
      JSON.stringify({ message: "If an account exists, a password reset email will be sent." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "An error occurred while processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
