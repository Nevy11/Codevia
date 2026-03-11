import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import WebPush from "npm:web-push@3.6.7"

// 1. Define CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!

WebPush.setVapidDetails(
  'mailto:smongare2003@gmail.com', 
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

serve(async (req) => {
  // 2. Handle the Preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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
      return new Response(JSON.stringify({ error: 'No subscription found' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const payload = JSON.stringify({
      notification: {
        title: title,
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/1827/1827347.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1827/1827347.png',
        data: {
          url: 'https://codevia.vercel.app' 
        }
      }
    })

    await WebPush.sendNotification(subData.subscription_json, payload)

    // 3. Include headers in Success response
    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    })

  } catch (err) {
    console.error("DETAILED_ERROR:", err.message);
    
    // 4. Include headers in Error response
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  }
})