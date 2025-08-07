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
  loading = true;
  profile: Profile | null = null;

  private profileService = inject(ProfileSettingsService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private supabaseService = inject(SupabaseClientService);
  async ngOnInit() {
    // const {
    //   data: { user },
    // } = await this.supabaseService.client.auth.getUser();
    // if (user && user.email) {
    //   console.log(
    //     `User Email then loading profile from supabase: `,
    //     user.email
    //   ); // <-- user's login email

    //   this.loading = false;
    //   // this.profileService.loadProfile(user.email);
    // }
    this.profile = await this.supabaseService.getProfile();

    // this.profileService.profile$.subscribe((profile) => {
    //   this.profile = profile;
    // });
  }

  // onFileSelected(event: Event) {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const updated_image: Profile = {
  //       name: this.profile.name,
  //       email: this.profile.email,
  //       bio: this.profile.bio,
  //       avatarUrl: reader.result as string,
  //     };
  //     this.profileService.updateProfile(updated_image);
  //   };
  //   reader.readAsDataURL(file);
  // }
  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // 1. Upload to Supabase Storage
    // const fileName = `avatars/${Date.now()}-${file.name}`;
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await this.supabaseService.client.storage
      .from('avatars') // Make sure you created "avatars" bucket in Supabase
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Avatar upload error:', error);
      return;
    }

    // 2. Get the public URL for the avatar
    const { data: publicUrlData } = this.supabaseService.client.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = publicUrlData?.publicUrl || '';

    // 3. Update profile with Supabase URL
    // const updated_image: Profile = {
    //   name: this.profile.name,
    //   email: this.profile.email,
    //   bio: this.profile.bio,
    //   avatarUrl,
    // };
    // await this.profileService.updateProfile(updated_image);
  }

  cancelEdit() {
    // this.loadProfile(); // reload old values
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;
    });
    this.isEditing = false;
  }
  async save() {
    if (this.profile) {
      try {
        const updatedData = await this.supabaseService.updateProfile(
          this.profile.name,
          this.profile.bio,
          this.profile.avatarUrl
        );

        if (updatedData) {
          this.snackBar.open('Update successful', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/layout/settings']);
        } else {
          this.snackBar.open('Update failed. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error while updating profile:', error);
        this.snackBar.open('An error occurred.', 'Close', {
          duration: 3000,
        });
      }
    } else {
      this.snackBar.open('No profile data to save.', 'Close', {
        duration: 3000,
      });
    }
  }
}
