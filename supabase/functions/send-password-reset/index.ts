import { Resend } from 'https://esm.sh/resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.json()
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = payload as {
      user: {
        email: string
      }
      email_data: {
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    console.log(`Sending password reset email to: ${user.email}`)

    const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

    // HTML email template with spaceseller branding
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen - spaceseller</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f6f6f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; padding: 40px 20px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="color: #22c55e; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: -0.5px;">spaceseller</h1>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td align="center">
              <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 24px;">Passwort zurücksetzen</h2>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 20px;">
              <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin: 16px 0;">Hallo,</p>
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin: 16px 0;">
                Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für Ihr spaceseller-Konto (${user.email}) gestellt.
              </p>
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin: 16px 0;">
                Klicken Sie auf den Button unten, um Ihr Passwort zurückzusetzen:
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td align="center" style="padding: 32px 20px;">
              <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #22c55e; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 40px; border-radius: 6px;">Passwort zurücksetzen</a>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding: 0 20px;">
              <p style="color: #4a4a4a; font-size: 16px; line-height: 24px; margin: 16px 0;">
                Oder kopieren Sie diesen Link in Ihren Browser:
              </p>
              
              <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; margin: 16px 0;">
                <p style="color: #22c55e; font-size: 14px; line-height: 20px; word-break: break-all; margin: 0;">${resetLink}</p>
              </div>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 20px;">
              <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 32px 0;">
            </td>
          </tr>
          
          <!-- Warning -->
          <tr>
            <td style="padding: 0 20px;">
              <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 12px 0;">
                Dieser Link ist aus Sicherheitsgründen nur für kurze Zeit gültig.
              </p>
              
              <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 12px 0;">
                Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. Ihr Passwort bleibt unverändert.
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 20px;">
              <hr style="border: none; border-top: 1px solid #e6e6e6; margin: 32px 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 0 20px;">
              <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 32px 0 16px;">
                <strong>spaceseller</strong><br>
                Professionelle Immobilienfotografie & Bildbearbeitung<br>
                Klinkerberg 9, 86152 Augsburg
              </p>
              
              <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 0;">
                Diese E-Mail wurde automatisch versendet. Bitte antworten Sie nicht auf diese Nachricht.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Send email via Resend
    const { data: emailData, error } = await resend.emails.send({
      from: 'spaceseller <onboarding@resend.dev>', // Replace with your verified domain
      to: [user.email],
      subject: 'Passwort zurücksetzen - spaceseller',
      html,
    })

    if (error) {
      console.error('Failed to send email:', error)
      throw error
    }

    console.log('Password reset email sent successfully:', emailData)

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Error in send-password-reset function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
