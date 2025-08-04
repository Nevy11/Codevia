import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProfileSettingsService } from './profile-settings.service';
import { Profile } from './profile';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupabaseClientService } from '../../../supabase-client.service';

@Component({
  selector: 'nevy11-profile-settings',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss',
})
export class ProfileSettingsComponent implements OnInit {
  isEditing = false;
  profile!: Profile;

  private profileService = inject(ProfileSettingsService);
  private router = inject(Router);
  snackBar = inject(MatSnackBar);
  supabaseService = inject(SupabaseClientService);
  async ngOnInit() {
    const {
      data: { user },
    } = await this.supabaseService.client.auth.getUser();
    if (user && user.email) {
      console.log(user.email); // <-- user's login email
      this.profileService.loadProfile(user.email);
    }

    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated_image: Profile = {
        name: this.profile.name,
        email: this.profile.email,
        bio: this.profile.bio,
        avatarUrl: reader.result as string,
      };
      this.profileService.updateProfile(updated_image);
    };
    reader.readAsDataURL(file);
  }

  cancelEdit() {
    // this.loadProfile(); // reload old values
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });
    this.isEditing = false;
  }
  save() {
    const updatedProfile: Profile = {
      name: this.profile.name,
      email: this.profile.email,
      bio: this.profile.bio,
      avatarUrl: this.profile.avatarUrl,
    };
    this.profileService.updateProfile(updatedProfile);
    this.snackBar.open('update successful', `Close`, { duration: 3000 });
    this.router.navigate(['/layout/settings']);
  }
}
