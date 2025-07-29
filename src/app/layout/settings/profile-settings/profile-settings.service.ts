import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile } from './profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsService {
  private readonly defaultAvatar = '/about/laptop.jpg';
  private _profile = new BehaviorSubject<Profile>(this.loadFromStorage());
  profile$ = this._profile.asObservable();
  // load profileFrom localStorage
  private loadFromStorage(): Profile {
    return {
      name: localStorage.getItem('profile_name') || '',
      email: localStorage.getItem('profile_email') || '',
      bio: localStorage.getItem('profile_bio') || '',
      avatarUrl: localStorage.getItem('profile_avatar') || this.defaultAvatar,
    };
  }

  // Save profile to local storage
  private saveToStorage(profile: Profile) {
    localStorage.setItem('profile_name', profile.name);
    localStorage.setItem('profile_email', profile.email);
    localStorage.setItem('profile_bio', profile.bio);
    localStorage.setItem('profile_avatar', profile.avatarUrl);
  }

  // update profile
  updateProfile(profile: Profile) {
    this.saveToStorage(profile);
    this._profile.next(profile);
  }
}
