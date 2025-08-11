import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SupabaseClientService } from '../../../../supabase-client.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'nevy11-mobile-stepper',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './mobile-stepper.component.html',
  styleUrl: './mobile-stepper.component.scss',
})
export class MobileStepperComponent {
  private _formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private supabaseService = inject(SupabaseClientService);

  username!: string;
  bio!: string;
  avatar_url!: string;

  profile_picture = this._formBuilder.group({
    profile_picture: ['', Validators.required],
  });
  username_group = this._formBuilder.group({
    username: ['', Validators.required],
  });
  bio_group = this._formBuilder.group({
    bio: ['', Validators.required],
  });
  isLinear = false;

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    this.profileService.updateAvatarUrl(`${fileName}`);
    // console.log('Before the supabaseService');
    const { data, error } = await this.supabaseService.client.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    // console.log('After the upload');
    if (error) {
      console.error('Upload error: ', error.message);
    } else {
      console.log('File uploaded successfuly: ', data);
    }
  }

  validate_username() {
    if (this.username_group.get('username')?.value) {
      console.log(`username: ${this.username_group.get('username')?.value}`);
      this.profileService.updateName(
        `${this.username_group.get('username')?.value}`
      );
    } else {
      console.error('username not updated');
    }
  }

  validate_bio() {
    if (this.bio_group.get('bio')?.value) {
      console.log(`Bio: ${this.bio_group.get(`bio`)?.value}`);
      this.profileService.updateBio(`${this.bio_group.get(`bio`)?.value}`);
    } else {
      console.error('bio not updated');
    }
  }
  done() {
    const name$ = this.profileService.name$.subscribe((user_name) => {
      console.log('username: ', user_name);
      this.username = user_name;
    });
    const bio$ = this.profileService.bio$.subscribe((user_bio) => {
      console.log(`Bio: ${user_bio}`);
      this.bio = user_bio;
    });
    const avatar_url$ = this.profileService.avatarUrl$.subscribe(
      (user_avatar_url) => {
        console.log(`user_avatar_url: ${user_avatar_url}`);
        this.avatar_url = user_avatar_url;
      }
    );

    this.supabaseService.addProfile(this.username, this.bio, this.avatar_url);
  }
}
