import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers to allow requests from your web app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Replace with your app's URL for production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Delete user function initialized');

serve(async (req) => {
  // This is needed for the browser's preflight request.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Create a Supabase client with the Service Role Key
    const supabaseAdmin = createClient(
      // These environment variables are automatically available in Supabase Edge Functions
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 2. Get the user object from the request's authorization header
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));

    if (userError) {
      throw userError;
    }
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found or invalid token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const userId = user.id;
    console.log(`Attempting to delete user with ID: ${userId}`);

    // 3. Delete the user's profile from the 'profiles' table
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      console.error(`Error deleting profile for user ID: ${userId}`, profileDeleteError.message);
      // Even if profile deletion fails, we can proceed to delete the auth user,
      // but it's important to log this failure.
    } else {
      console.log(`Successfully deleted profile for user ID: ${userId}`);
    }

    // 4. Use the admin client to delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw deleteError;
    }

    console.log(`Successfully deleted auth user with ID: ${userId}`);

    // 5. Return a success message
    return new Response(JSON.stringify({ message: `User ${userId} deleted successfully.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in delete-user function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
