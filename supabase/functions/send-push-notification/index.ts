import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import WebPush from "npm:web-push@3.6.7"

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!

WebPush.setVapidDetails(
  'mailto:smongare2003@gmail.com', 
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (req) => {
  try {
    const { user_id, title, message } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: subData, error } = await supabase
      .from('push_subscriptions')
      .select('subscription_json')
      .eq('user_id', user_id)
      .single()

    if (error || !subData) {
      return new Response(JSON.stringify({ error: 'No subscription found' }), { status: 404 })
    }

    const payload = JSON.stringify({
      notification: {
        title: title,
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827347.png', // Placeholder
        badge: 'https://cdn-icons-png.flaticon.com/512/1827/1827347.png',
        data: {
          url: 'https://your-hosted-app.vercel.app' // Optional: Clicking the notification opens this
        }
      }
    })

    await WebPush.sendNotification(subData.subscription_json, payload)

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" } 
    })

  } catch (err) {
    // This logs to the Supabase Dashboard "Logs" tab
    console.error("DETAILED_ERROR:", err.message);
    
    return new Response(
      JSON.stringify({ 
        error: err.message, 
        details: "Check Supabase Function Logs for full stack trace" 
      }), 
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
})