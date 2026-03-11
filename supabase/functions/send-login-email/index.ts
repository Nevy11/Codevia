import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../cors.ts" // Import the headers

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // 1. Handle CORS Preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('user_settings')
      .select('email_notifications')
      .eq('user_id', user_id)
      .single()

    if (settingsError || !settings?.email_notifications) {
      return new Response(
        JSON.stringify({ message: 'Disabled' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id)
    
    if (userError || !user?.email) throw new Error('User not found')
    

    const userAgent = req.headers.get('user-agent') || 'Unknown Device';
    const loginTime = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Codevia <onboarding@resend.dev>',
        to: [user.email],
        subject: 'Security Alert: New Login to Codevia ',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
            .header { text-align: center; padding: 20px 0; background-color: #f8fafc; border-radius: 8px 8px 0 0; }
            /* Brand Logo Colors from your Toolbar */
            .logo { font-size: 28px; font-weight: bold; letter-spacing: 1px; }
            .c1 { color: #0d47a1; } .c2 { color: #29b6f6; } .c3 { color: #7e57c2; } 
            .c4 { color: #b39ddb; } .c5 { color: #00e676; } .c6 { color: #ffa726; } .c7 { color: #e91e63; }
            
            .content { padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
            .alert-box { background-color: #f1f5f9; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 5px solid #0d47a1; }
            .detail-row { font-size: 14px; margin-bottom: 5px; color: #475569; }
            .button { display: inline-block; padding: 12px 25px; background-color: #0d47a1; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px; }
            .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <span class="c1">C</span><span class="c2">o</span><span class="c3">d</span><span class="c4">e</span><span class="c5">V</span><span class="c6">i</span><span class="c7">a</span>
              </div>
            </div>
            <div class="content">
              <h2 style="margin-top: 0; color: #0d47a1;">New Login Detected</h2>
              <p>Hi there,</p>
              <p>Someone just logged into your Codevia account. Was this you?</p>
              
              <div class="alert-box">
                <div class="detail-row"><strong>When:</strong> ${loginTime} (EAT)</div>
                <div class="detail-row"><strong>Device:</strong> ${userAgent}</div>
                <div class="detail-row"><strong>Action:</strong> Account Login</div>
              </div>

              <p>If this was you, you can safely ignore this message. If not, please click the button below to secure your account.</p>
              
              <center>
                <a href="https://codevia.vercel.app/layout/settings" class="button">Protect My Account</a>
              </center>
            </div>
            <div class="footer">
              <p>&copy; 2026 Codevia. All rights reserved.<br>
              Kenya's AI-Powered Learning Hub.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      }),
    });



    const resData = await res.json()
    
    // 2. Add headers to the success response
    return new Response(
      JSON.stringify(resData), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    // 3. Add headers to the error response
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})