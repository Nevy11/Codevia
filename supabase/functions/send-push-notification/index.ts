import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import WebPush from "https://esm.sh/web-push@3.6.6"

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!

WebPush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your actual email
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (req) => {
  try {
    const { user_id, title, message } = await req.json()

    // 1. Initialize Supabase Admin Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 2. Fetch the browser subscription we saved in Step B
    const { data: subData, error } = await supabase
      .from('push_subscriptions')
      .select('subscription_json')
      .eq('user_id', user_id)
      .single()

    if (error || !subData) {
      return new Response(JSON.stringify({ error: 'No subscription found' }), { status: 404 })
    }

    // 3. Send the Push Notification!
    const payload = JSON.stringify({
      notification: {
        title: title,
        body: message,
        icon: 'https://your-app.com/assets/icons/icon-96x96.png', // Update to your icon path
        badge: 'https://your-app.com/assets/icons/badge-72x72.png'
      }
    })

    await WebPush.sendNotification(subData.subscription_json, payload)

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" } 
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})