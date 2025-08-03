import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile } from './profile';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsService {
  private isBrowser: boolean;
  private readonly defaultAvatar = '/about/laptop.jpg';
  private _profile = new BehaviorSubject<Profile>(this.loadFromStorage());
  profile$ = this._profile.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._profile = new BehaviorSubject<Profile>(this.loadFromStorage());
  }

  private loadFromStorage(): Profile {
    if (!this.isBrowser) {
      return {
        name: '',
        email: '',
        bio: '',
        avatarUrl: this.defaultAvatar,
      };
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

  // update profile
  updateProfile(profile: Profile) {
    this.saveToStorage(profile);
    this._profile.next(profile);
  }
}

// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { BehaviorSubject } from 'rxjs';
// import { Profile } from './profile';

// @Injectable({ providedIn: 'root' })
// export class ProfileSettingsService {
//   private readonly defaultAvatar = '/about/laptop.jpg';
//   private isBrowser: boolean;
//   private _profile!: BehaviorSubject<Profile>;

//   constructor(@Inject(PLATFORM_ID) platformId: object) {
//     this.isBrowser = isPlatformBrowser(platformId);
//     this._profile = new BehaviorSubject<Profile>(this.loadFromStorage());
//   }

//   profile$ = this._profile.asObservable();

//   private loadFromStorage(): Profile {
//     if (!this.isBrowser) {
//       return {
//         name: '',
//         email: '',
//         bio: '',
//         avatarUrl: this.defaultAvatar,
//       };
//     }
//     return {
//       name: localStorage.getItem('profile_name') || '',
//       email: localStorage.getItem('profile_email') || '',
//       bio: localStorage.getItem('profile_bio') || '',
//       avatarUrl: localStorage.getItem('profile_avatar') || this.defaultAvatar,
//     };
//   }

//   private saveToStorage(profile: Profile) {
//     if (!this.isBrowser) return;
//     localStorage.setItem('profile_name', profile.name);
//     localStorage.setItem('profile_email', profile.email);
//     localStorage.setItem('profile_bio', profile.bio);
//     localStorage.setItem('profile_avatar', profile.avatarUrl);
//   }

//   updateProfile(profile: Profile) {
//     this.saveToStorage(profile);
//     this._profile.next(profile);
//   }
// }
