import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from './layout/settings/profile-settings/profile';
import { VideoSaving } from './layout/learning/video-section/video-saving';
import { GetVideo } from './layout/learning/video-section/get-video';
import { VideoThumbnails } from './layout/user-stats/video-thumbnails';

@Injectable({
  providedIn: 'root',
})
export class SupabaseClientService {
  private supabase!: SupabaseClient;
  private user_id: string | null = null;
  private is_course_stat_init: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        'https://xzeysnqxzmzlfbzfjhys.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZXlzbnF4em16bGZiemZqaHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjU5MzMsImV4cCI6MjA2OTU0MTkzM30.dG4lwMFKtTpklmOu_tZeFrRZy-vvYhdjwsO2zz2yaNE'
      );
    }
  }
  get client() {
    return this.supabase;
  }

  // adding a profile
  async addProfile(name: string, bio: string, avatar_url: string) {
    const {
      data: { user },
    } = await this.client.auth.getUser();
    if (user && user.email) {
      const { data, error } = await this.supabase
        .from('profiles')
        .insert([
          {
            name: name,
            email: user.email,
            bio: bio,
            avatar_url: avatar_url,
          },
        ])
        .select();

      if (error) {
        console.error(error);
      } else {
        console.log('Inserted profile: ', data);
      }
    }
  }

  // Removing a profile
  async removeProfile(): Promise<boolean> {
    const {
      data: { user },
    } = await this.client.auth.getUser();
    if (!user || !user.email) {
      console.error('No logged-in user found');
      return false;
    }

    const { data, error } = await this.client
      .from('profiles')
      .delete()
      .eq('email', user.email) // delete profile by matching the user's email
      .select();

    if (error) {
      console.error('Error deleting profile:', error);
      return false;
    } else {
      console.log('Deleted profile:', data);
      return true;
    }
  }

  // Geting one single profile
  async getProfile(): Promise<Profile | null> {
    if (!this.client) {
      return null;
    }
    const {
      data: { user },
    } = await this.client.auth.getUser();

    if (!user || !user.email) {
      console.error('No logged-in user found');
      return null;
    }

    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .ilike('email', user.email)
      .maybeSingle(); // safer: no error if no rows

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      console.warn('No profile found for email:', user.email);
      return null;
    }

    const profile: Profile = {
      name: data.name,
      email: data.email,
      bio: data.bio,
      avatarUrl: data.avatar_url,
    };

    console.log('Fetched profile:', profile);
    return profile;
  }

  // Getting all profiles
  async getAllProfiles() {
    const { data, error } = await this.client.from('profiles').select('*'); // fetch every profile

    if (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
    console.log('All profiles:', data);
    return data;
  }
  // Update profile
  async updateProfile(name: string, bio: string, avatar_url: string) {
    const {
      data: { user },
    } = await this.client.auth.getUser();
    if (!user || !user.email) {
      console.error('No logged-in user found');
      return null;
    }
    console.log(avatar_url);

    const { data, error } = await this.client
      .from('profiles')
      .upsert(
        {
          email: user.email,
          name,
          bio,
          avatar_url,
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    if (data.length === 0) {
      console.warn('No profile found for this email:', user.email);
      return null;
    }

    console.log('Updated profile:', data);
    return data;
  }

  // sign out
  async logout() {
    const { error } = await this.client.auth.signOut();

    if (error) {
      console.error('Logout error:', error.message);
      return false;
    } else {
      console.log('sign out successful');
      return true;
    }
  }

  // Checks if it's the first time the user is updating (i.e., no profile exists yet)
  async isFirstTimeProfileUpdate(): Promise<boolean> {
    const {
      data: { user },
    } = await this.client.auth.getUser();

    if (!user || !user.email) {
      console.error('No logged-in user found');
      return true; // Treat as first time if no user
    }

    const { data, error } = await this.client
      .from('profiles')
      .select('id')
      .ilike('email', user.email)
      .maybeSingle();

    if (error) {
      console.error('Error checking profile existence:', error);
      return true;
    }

    if (data === null) {
      // console.log('First time user');
      return true;
    }

    // console.log('Not a first time user');
    return false;
  }

  // Save or update the user's video progress
  async saveVideoProgress(video_data: VideoSaving): Promise<Boolean> {
    const { data, error } = await this.client
      .from('user_video_progress')
      .upsert(
        {
          user_id: video_data.userId,
          video_id: video_data.videoId,
          playback_position: video_data.currentTime,
        },
        {
          onConflict: 'user_id, video_id', // Ensures update instead of duplicate data
        }
      );

    if (error) {
      console.error('Error saving video progress: ', error.message);
      return false;
    }
    return true;
  }

  // Getting the saved video progress for resume
  async getVideoProgress(video_data: GetVideo) {
    if (!this.client) {
      return 0;
    }
    const { data, error } = await this.client
      .from('user_video_progress')
      .select('playback_position')
      .eq('user_id', video_data.userId)
      .eq('video_id', video_data.videoId)
      .single();
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching video Progress: ', error.message);
      return 0;
    }
    return data?.playback_position || 0;
  }

  // Getting user curren't id
  async getCurrentUserId(): Promise<string | null> {
    if (!this.client) {
      return null;
    }
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('Error fetching current user:', error.message);
      return null;
    }
    return data.user?.id || null;
  }
  async store_video_thumbnail(
    video_id: string,
    thumbnail_url: string
  ): Promise<boolean> {
    const { error } = await this.client.from('video_thumbnails').upsert(
      {
        video_id: video_id,
        thumbnail_url: thumbnail_url,
      },
      { onConflict: 'video_id' }
    );

    if (error) {
      console.error('Error storing video thumbnail:', error.message);
      return false;
    }

    return true;
  }

  async getUserVideos(): Promise<any[]> {
    this.user_id = await this.getCurrentUserId();
    if (!this.user_id) {
      console.error('No user logged in');
      return [];
    }
    const { data, error } = await this.client
      .from('user_video_progress')
      .select('video_id, playback_position')
      .eq('user_id', this.user_id);

    if (error) {
      console.error('Error fetching user videos: ', error.message);
      return [];
    }

    return data || [];
  }

  async get_video_thumbnail(video_id: string): Promise<string | null> {
    const { data, error } = await this.client
      .from('video_thumbnails')
      .select('thumbnail_url')
      .eq('video_id', video_id)
      .order('created_at', { ascending: false }) // in case multiple thumbnails exist
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching video thumbnail:', error.message);
      return null;
    }

    return data?.thumbnail_url || null;
  }

  // Getting all video thumbnails stored
  async getAllVideoThumbnails(): Promise<VideoThumbnails[] | null> {
    const { data, error } = await this.client
      .from('video_thumbnails')
      .select('video_id, thumbnail_url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching video thumbnails:', error.message);
      return null;
    }

    return data;
  }

  // Enroll in a course (increment courses_enrolled by 1)
  async enrollCourse(user_id: string): Promise<boolean> {
    const { error } = await this.client.rpc('increment_enrolled', {
      uid: user_id,
    });

    if (error) {
      console.error('Error updating enrolled courses:', error);
      return false;
    }
    return true;
  }

  // Complete a course (increment courses_completed by 1)
  async completeCourse(): Promise<boolean> {
    this.user_id = await this.getCurrentUserId();
    if (this.user_id) {
      const { error } = await this.client.rpc('increment_completed', {
        uid: this.user_id,
      });

      if (error) {
        console.error('Error updating completed courses:', error);
        return false;
      }
      return true;
    } else {
      console.error('Error while initializing the user id');
      return false;
    }
  }

  // Get courses enrolled & completed for a user
  async getCourseStats(
    user_id: string
  ): Promise<{ enrolled: number; completed: number } | null> {
    const { data, error } = await this.client
      .from('user_course_stats')
      .select('courses_enrolled, courses_completed')
      .eq('user_id', user_id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching course stats:', error);
      return null;
    }

    if (!data) {
      this.is_course_stat_init = await this.initUserCourseStats();
      if (this.is_course_stat_init) {
        const { data, error } = await this.client
          .from('user_course_stats')
          .select('courses_enrolled, courses_completed')
          .eq('user_id', user_id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching course stats:', error);
          return null;
        }
        if (!data) {
          console.error("Aaah, too bad, error can't be solved");
          return null;
        }
        return {
          enrolled: data.courses_enrolled,
          completed: data.courses_completed,
        };
      }
      console.error('Failed to initialize the data');
      return null;
    }

    return {
      enrolled: data.courses_enrolled,
      completed: data.courses_completed,
    };
  }

  // Initialize course stats when a user signs up for the first time
  async first_time_enroll_0_course(): Promise<boolean> {
    this.user_id = await this.getCurrentUserId();
    if (this.user_id) {
      const { error } = await this.client.from('user_course_stats').insert({
        user_id: this.user_id,
        courses_enrolled: 0,
        courses_completed: 0,
      });

      if (error) {
        console.error('Error initializing course stats:', error);
        return false;
      }

      return true;
    } else {
      console.error('Failed to get user id');
      return false;
    }
  }

  async initUserCourseStats(): Promise<boolean> {
    this.user_id = await this.getCurrentUserId();
    if (!this.user_id) {
      console.error('Failed to initialize userid');
      return false;
    }
    const { error } = await this.client.from('user_course_stats').upsert(
      {
        user_id: this.user_id,
        courses_enrolled: 0,
        courses_completed: 0,
      },
      { onConflict: 'user_id' } // ensures no duplicates if row exists
    );

    if (error) {
      console.error('Error initializing course stats:', error);
      return false;
    }

    return true;
  }
  /// Create or update a folder
  async createOrUpdateFolder(
    folderName: string,
    parentFolder: string | null = null
  ) {
    this.user_id = await this.getCurrentUserId();
    if (!this.user_id) {
      console.error('No user logged in');
      return null;
    }

    const { data, error } = await this.client
      .from('files')
      .upsert(
        [
          {
            user_id: this.user_id,
            folder_name: folderName,
            file_name: null, // always null for folders
            file_type: 'folder',
            lines: [],
            children: [],
            parent_folder: parentFolder,
          },
        ],
        {
          onConflict: 'user_id,parent_folder,folder_name', // 👈 match rule
        }
      )
      .select(); // return updated row

    if (error) {
      console.error('Error creating/updating folder:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error('No folder data returned after upsert');
      return null;
    }

    console.log('Folder created/updated:', data[0]);
    return data[0];
  }
}
