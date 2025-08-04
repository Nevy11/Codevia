import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile } from './profile';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClientService } from '../../../supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsService {
  private readonly defaultAvatar = '/about/laptop.jpg';
  private isBrowser: boolean;
  private _profile = new BehaviorSubject<Profile>(this.loadFromStorage());
  profile$ = this._profile.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private supabaseService: SupabaseClientService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private loadFromStorage(): Profile {
    if (!this.isBrowser) {
      return { name: '', email: '', bio: '', avatarUrl: this.defaultAvatar };
    }
    return {
      name: localStorage.getItem('profile_name') || '',
      email: localStorage.getItem('profile_email') || '',
      bio: localStorage.getItem('profile_bio') || '',
      avatarUrl: localStorage.getItem('profile_avatar') || this.defaultAvatar,
    };
  }

  private saveToStorage(profile: Profile) {
    if (!this.isBrowser) return;
    localStorage.setItem('profile_name', profile.name);
    localStorage.setItem('profile_email', profile.email);
    localStorage.setItem('profile_bio', profile.bio);
    localStorage.setItem('profile_avatar', profile.avatarUrl);
  }

  /** Load profile from Supabase (or localStorage fallback) */
  async loadProfile(email: string) {
    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (!error && data) {
      const profile: Profile = {
        name: data.name,
        email: data.email,
        bio: data.bio,
        avatarUrl: data.avatar_url || this.defaultAvatar,
      };
      this._profile.next(profile);
      this.saveToStorage(profile);
    } else {
      this._profile.next(this.loadFromStorage());
    }
  }

  /** Update both Supabase & localStorage */
  async updateProfile(profile: Profile) {
    const { error } = await this.supabaseService.client
      .from('profiles')
      .upsert({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
      });

    if (!error) {
      this.saveToStorage(profile);
      this._profile.next(profile);
    } else {
      console.error('Supabase update error', error);
    }
  }
}
