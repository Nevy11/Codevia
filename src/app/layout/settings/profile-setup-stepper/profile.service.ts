// profile.service.ts
import { Injectable } from '@angular/core'; // optional if not using Angular
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Profile } from './profileModel';

@Injectable({ providedIn: 'root' }) // remove if pure TS
export class ProfileService {
  // default initial profile (can be empty or loaded from storage/backend)
  private readonly defaultProfile: Profile = {
    name: '',
    bio: '',
    avatar_url: '',
  };

  // BehaviorSubject holds current profile and emits current value immediately to new subscribers
  private profileSubject = new BehaviorSubject<Profile>({
    ...this.defaultProfile,
  });

  // Public observable (read-only)
  public readonly profile$: Observable<Profile> =
    this.profileSubject.asObservable();

  // Convenience observables for individual fields
  public readonly name$ = this.profile$.pipe(
    map((p) => p.name),
    distinctUntilChanged()
  );
  public readonly bio$ = this.profile$.pipe(
    map((p) => p.bio),
    distinctUntilChanged()
  );
  public readonly avatarUrl$ = this.profile$.pipe(
    map((p) => p.avatar_url),
    distinctUntilChanged()
  );

  // Get current value synchronously
  get currentProfile(): Profile {
    return this.profileSubject.getValue();
  }

  // Replace entire profile (emit)
  setProfile(profile: Partial<Profile>) {
    const next = { ...this.currentProfile, ...profile };
    this.profileSubject.next(next);
  }

  // Update single fields
  updateName(name: string) {
    if (name === this.currentProfile.name) return;
    this.profileSubject.next({ ...this.currentProfile, name });
  }

  updateBio(bio: string) {
    if (bio === this.currentProfile.bio) return;
    this.profileSubject.next({ ...this.currentProfile, bio });
  }

  updateAvatarUrl(avatar_url: string) {
    console.log(`Avatar url updated: ${avatar_url}`);
    if (avatar_url === this.currentProfile.avatar_url) return;
    this.profileSubject.next({ ...this.currentProfile, avatar_url });
  }

  // reset to defaults
  reset() {
    this.profileSubject.next({ ...this.defaultProfile });
  }

  // Example: apply a partial update coming from server or WebSocket
  applyServerPatch(patch: Partial<Profile>) {
    this.setProfile(patch);
  }
}
