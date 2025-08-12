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
import { ProfileService } from '../profile-setup-stepper/profile.service';

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
  imageUrl: string = '';

  private profileService = inject(ProfileService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private supabaseService = inject(SupabaseClientService);
  async ngOnInit() {
    this.loading = false;

    this.profile = await this.supabaseService.getProfile();
    if (this.profile) {
      this.imageUrl = this.profile.avatarUrl;
    }

    console.log('Avatar url: ', this.profile?.avatarUrl);
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    console.log('Before the supabaseService');

    // Upload the file once
    const { data, error } = await this.supabaseService.client.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // overwrite if exists, or set to false to prevent overwriting
      });

    console.log('After the upload');

    if (error) {
      console.error('Upload error: ', error.message);
      return; // stop if upload failed
    }

    console.log('File uploaded successfully: ', data);

    // Get the public URL for the uploaded file
    const { data: urlData } = this.supabaseService.client.storage
      .from('avatars')
      .getPublicUrl(fileName);

    console.log('Public URL:', urlData.publicUrl);

    // Use the URL to display the image
    this.imageUrl = urlData.publicUrl;
    let avatar_url: string | null = null;

    this.profileService.updateAvatarUrl(urlData.publicUrl);

    this.profileService.avatarUrl$.subscribe((url) => {
      avatar_url = url;
      this.imageUrl = url;
      console.log(avatar_url);
    });
    if (this.profile) {
      this.profileService.updateName(this.profile.name);
      this.profileService.updateBio(this.profile.bio);
      console.log(this.profile.name);
      console.log(this.profile.bio);
      this.profile.avatarUrl = this.imageUrl;
      this.supabaseService.updateProfile(
        this.profile.name,
        this.profile.bio,
        this.imageUrl
      );
      console.log('update successful');
    } else {
      console.error(' error while updating the data');
    }
    // this.profileService.bio$.subscribe((url) => {
    //   bio = url;
    //   console.log(bio);
    // });
    // this.profileService.name$.subscribe((url) => {
    //   name = url;
    //   console.log(name);
    // });
    // if (name && bio && avatar_url) {
    //   this.supabaseService.updateProfile(name, bio, avatar_url);
    //   console.log('update successful');
    // } else {
    //   console.error(' error while updating the data');
    // }
  }

  cancelEdit() {
    // this.loadProfile(); // reload old values
    // this.profileService.profile$.subscribe((profile) => {
    //   this.profile = profile;
    // });
    this.isEditing = false;
  }
  async save() {
    if (this.profile) {
      this.profileService.updateName(this.profile.name);
      this.profileService.updateBio(this.profile.bio);
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
