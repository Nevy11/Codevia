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
import { ProfileService } from '../profile.service';
import { SupabaseClientService } from '../../../../supabase-client.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'nevy11-non-mobile-stepper',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './non-mobile-stepper.component.html',
  styleUrl: './non-mobile-stepper.component.scss',
})
export class NonMobileStepperComponent {
  private _formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private supabaseService = inject(SupabaseClientService);
  private snackbar = inject(MatSnackBar);

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

  previewUrl: string | null = null;

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // 1. Preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;

      // As soon as preview appears, mark form as valid
      this.profile_picture.get('profile_picture')?.setValue('done');
    };
    reader.readAsDataURL(file);

    // 2. Upload to Supabase
    const fileName = `${Date.now()}-${file.name}`;
    this.profileService.updateAvatarUrl(fileName);

    const { error } = await this.supabaseService.client.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error: ', error.message);
      return;
    }

    // 3. Automatically move to next stepper
    const nativeMatStepper = document.querySelector('mat-stepper');
    (nativeMatStepper as any).next();
  }

  validate_username() {
    if (this.username_group.get('username')?.value) {
      this.profileService.updateName(
        `${this.username_group.get('username')?.value}`
      );
      console.log('username updated');
    } else {
      console.error('username not updated');
    }
  }

  validate_bio() {
    if (this.bio_group.get('bio')?.value) {
      this.profileService.updateBio(`${this.bio_group.get(`bio`)?.value}`);
    } else {
      console.error('bio not updated');
    }
    this.snackbar.open('Profile setup completed!', 'Close', { duration: 3000 });
    this.snackbar.open(
      `Click done to complete the registration process`,
      'Close',
      { duration: 3000 }
    );
    console.log('bio updated');
  }
  done() {
    const name$ = this.profileService.name$.subscribe((user_name) => {
      this.username = user_name;
    });
    const bio$ = this.profileService.bio$.subscribe((user_bio) => {
      this.bio = user_bio;
    });
    const avatar_url$ = this.profileService.avatarUrl$.subscribe(
      (user_avatar_url) => {
        this.avatar_url = user_avatar_url;
      }
    );
    console.log('done clicked with ', this.username, this.bio, this.avatar_url);
    this.supabaseService.addProfile(this.username, this.bio, this.avatar_url);
  }
}
