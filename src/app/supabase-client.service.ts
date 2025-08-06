import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  async getProfile() {
    const {
      data: { user },
    } = await this.client.auth.getUser();
    if (!user || !user.email) {
      console.error('No logged-in user found');
      return null;
    }

    const { data, error } = await this.client
      .from('profiles')
      .select('*') // fetch all columns
      .eq('email', user.email) // filter by the logged-in user's email
      .single(); // expect only one profile row

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    console.log('Fetched profile:', data);
    return data;
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

    const { data, error } = await this.client
      .from('profiles')
      .update({
        name: name,
        bio: bio,
        avatar_url: avatar_url,
      })
      .eq('email', user.email) // update the row for this user's email
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    console.log('Updated profile:', data);
    return data;
  }
}
