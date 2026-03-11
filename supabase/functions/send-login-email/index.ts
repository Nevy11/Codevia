import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../cors.ts" 

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')


serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { user_id, type } = await req.json() 
    const isLogin = type === 'login';

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check settings
    const { data: settings } = await supabaseAdmin
      .from('user_settings')
      .select('email_notifications')
      .eq('user_id', user_id)
      .single()

    if (!settings?.email_notifications) {
      return new Response(JSON.stringify({ message: 'Disabled' }), { headers: corsHeaders })
    }

    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(user_id)
    if (!user?.email) throw new Error('User not found')

    const loginTime = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
    
    // Customizing the content based on type
    const subject = isLogin ? 'Security Alert: New Login to Codevia ' : 'Session Ended: Logout Successful ';
    const statusText = isLogin ? 'New Login Detected' : 'Successfully Logged Out';
    const bodyText = isLogin 
      ? 'Someone just logged into your Codevia account. Was this you?' 
      : 'Your active session on Codevia has been closed. If this wasn\'t you, your account might be compromised.';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Codevia <onboarding@resend.dev>',
        to: [user.email],
        subject: subject,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .logo { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
            .c1 { color: #0d47a1; } .c2 { color: #29b6f6; } .c3 { color: #7e57c2; } 
            .c4 { color: #b39ddb; } .c5 { color: #00e676; } .c6 { color: #ffa726; } .c7 { color: #e91e63; }
            .alert-box { background-color: #f8fafc; border-radius: 8px; padding: 15px; border-left: 5px solid ${isLogin ? '#0d47a1' : '#e91e63'}; }
            .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <span class="c1">C</span><span class="c2">o</span><span class="c3">d</span><span class="c4">e</span><span class="c5">V</span><span class="c6">i</span><span class="c7">a</span>
            </div>
            <h2 style="color: ${isLogin ? '#0d47a1' : '#e91e63'};">${statusText}</h2>
            <p>${bodyText}</p>
            <div class="alert-box">
              <div><strong>Time:</strong> ${loginTime} (EAT)</div>
              <div><strong>Status:</strong> ${isLogin ? 'Logged In' : 'Logged Out'}</div>
            </div>
            <p style="font-size: 13px;">If you recognize this activity, no further action is needed.</p>
            <div class="footer">© 2026 Codevia AI - Kenya</div>
          </div>
        </body>
        </html>
        `,
      }),
    })

    const resData = await res.json()
    return new Response(JSON.stringify(resData), { headers: corsHeaders, status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 })
  }
})