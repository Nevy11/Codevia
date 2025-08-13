import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from './layout/settings/profile-settings/profile';

@Injectable({
  providedIn: 'root',
})
export class SupabaseClientService {
  private supabase!: SupabaseClient;
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
    //     if (!this.client) {
    //   return null; // or throw an error, or skip the auth call
    // }
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
  async removeProfile() {
    //     if (!this.client) {
    //   return null; // or throw an error, or skip the auth call
    // }
    const {
      data: { user },
    } = await this.client.auth.getUser();
    if (!user || !user.email) {
      console.error('No logged-in user found');
      return;
    }

    const { data, error } = await this.client
      .from('profiles')
      .delete()
      .eq('email', user.email) // delete profile by matching the user's email
      .select();

    if (error) {
      console.error('Error deleting profile:', error);
    } else {
      console.log('Deleted profile:', data);
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
    // const { data, error } = await this.client
    //   .from('profiles')
    //   .update({
    //     name: name,
    //     bio: bio,
    //     avatar_url: avatar_url,
    //   })
    //   .eq('id', user.id)
    //   .select();
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
}
