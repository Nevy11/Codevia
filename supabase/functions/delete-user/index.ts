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
    console.log('Delete user function started.');

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
      console.error('Error getting user:', userError.message);
      throw userError;
    }
    if (!user) {
      console.error('User not found or invalid token.');
      return new Response(JSON.stringify({ error: 'User not found or invalid token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const userId = user.id;
    console.log(`Attempting to delete all data for user with ID: ${userId}`);

    // Fetch the user's profile to get the avatar_url before deleting the profile.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
        console.error(`Could not fetch profile for user ${userId}: ${profileError.message}`);
    } else {
        console.log(`Profile for user ${userId}:`, profile);
    }

    // Handle indirect deletion for 'video_thumbnails' before deleting the user's video progress
    const { data: videoProgress, error: videoProgressError } = await supabaseAdmin
      .from('user_video_progress')
      .select('video_id')
      .eq('user_id', userId);

    if (videoProgressError) {
      console.error('Could not fetch video_ids for user:', videoProgressError.message);
    } else if (videoProgress && videoProgress.length > 0) {
      console.log(`Found ${videoProgress.length} video progress entries to clean up thumbnails.`);
      const videoIds = videoProgress.map((v) => v.video_id);
      
      const { error: thumbnailDeleteError } = await supabaseAdmin
        .from('video_thumbnails')
        .delete()
        .in('video_id', videoIds);
      
      if (thumbnailDeleteError) {
        console.error('Error deleting video_thumbnails for user:', thumbnailDeleteError.message);
      } else {
        console.log('Successfully cleaned video_thumbnails for user.');
      }
    } else {
        console.log('No video progress found for thumbnail cleanup.');
    }

    // Define tables with 'user_id' and 'id' foreign keys
    const tablesWithUserId = [
      'user_settings',
      'files',
      'user_course_stats',
      'user_video_progress',
    ];
    const tablesWithId = ['profiles'];

    // Delete from tables with 'user_id'
    for (const table of tablesWithUserId) {
      console.log(`Checking table '${table}' for rows with user_id: ${userId}`);
      const { data: rows, error: selectError } = await supabaseAdmin.from(table).select('id').eq('user_id', userId);

      if (selectError) {
        console.error(`Error selecting from ${table}:`, selectError.message);
        continue;
      }

      if (rows && rows.length > 0) {
        console.log(`Found ${rows.length} rows to delete in ${table}.`);
        const { error: deleteError } = await supabaseAdmin.from(table).delete().eq('user_id', userId);
        if (deleteError) {
          console.error(`Error deleting from ${table}:`, deleteError.message);
        } else {
          console.log(`Successfully deleted from ${table}.`);
        }
      } else {
        console.log(`No rows found to delete in ${table}.`);
      }
    }

    // Delete from tables with 'id'
    for (const table of tablesWithId) {
      console.log(`Checking table '${table}' for rows with id: ${userId}`);
      const { data: rows, error: selectError } = await supabaseAdmin.from(table).select('id').eq('id', userId);

      if (selectError) {
        console.error(`Error selecting from ${table}:`, selectError.message);
        continue;
      }

      if (rows && rows.length > 0) {
        console.log(`Found ${rows.length} rows to delete in ${table}.`);
        const { error: deleteError } = await supabaseAdmin.from(table).delete().eq('id', userId);
        if (deleteError) {
          console.error(`Error deleting from ${table}:`, deleteError.message);
        } else {
          console.log(`Successfully deleted from ${table}.`);
        }
      } else {
        console.log(`No rows found to delete in ${table}.`);
      }
    }

    // Clean up user's avatar from Supabase Storage
    if (profile && profile.avatar_url) {
      console.log('Attempting to delete avatar:', profile.avatar_url);
      try {
        const avatarUrl = new URL(profile.avatar_url);
        const avatarPath = avatarUrl.pathname.split('/avatars/')[1];

        if (avatarPath) {
          const { error: removeError } = await supabaseAdmin.storage.from('avatars').remove([avatarPath]);

          if (removeError) {
            console.error(`Error removing avatar for user ${userId}: ${removeError.message}`);
          } else {
            console.log(`Successfully removed avatar for user ${userId}`);
          }
        }
      } catch (e) {
        console.error(`Failed to parse avatar URL or remove avatar for user ${userId}:`, e.message);
      }
    } else {
        console.log('No avatar found to delete.');
    }

    // Finally, delete the user from the auth schema
    console.log('Attempting to delete user from auth schema.');
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError.message);
      throw deleteError;
    }

    console.log(`Successfully deleted auth user with ID: ${userId}`);

    console.log('Delete user function finished successfully.');
    // Return a success message
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
