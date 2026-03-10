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
import { MatIconModule } from '@angular/material/icon';
import { NotificiationService } from '../../../../notificiation.service';
import { Router } from '@angular/router';

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
    MatIconModule,
  ],
  templateUrl: './mobile-stepper.component.html',
  styleUrl: './mobile-stepper.component.scss',
})
export class MobileStepperComponent {
  private _formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private supabaseService = inject(SupabaseClientService);
  private notify = inject(NotificiationService);
  private router = inject(Router);

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

  // async onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const file = input.files?.[0];
  //   if (!file) return;

  //   // 1. Preview image
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.previewUrl = reader.result as string;

  //     // As soon as preview appears, mark form as valid
  //     this.profile_picture.get('profile_picture')?.setValue('done');
  //   };
  //   reader.readAsDataURL(file);

  //   // 2. Upload to Supabase
  //   const fileName = `${Date.now()}-${file.name}`;
  //   this.profileService.updateAvatarUrl(fileName);

  //   const { error } = await this.supabaseService.client.storage
  //     .from('avatars')
  //     .upload(fileName, file, {
  //       cacheControl: '3600',
  //       upsert: false,
  //     });

  //   if (error) {
  //     console.error('Upload error: ', error.message);
  //     return;
  //   }

  //   // 3. Automatically move to next stepper
  //   const nativeMatStepper = document.querySelector('mat-stepper');
  //   (nativeMatStepper as any).next();
  // }

  validate_username() {
    if (this.username_group.get('username')?.value) {
      this.profileService.updateName(
        `${this.username_group.get('username')?.value}`
      );
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
    this.notify.show('Profile setup completed!');
    this.notify.show(
      `Click done to complete the registration process`,
      
    );
  }
  // done() {
  //   const name$ = this.profileService.name$.subscribe((user_name) => {
  //     this.username = user_name;
  //   });
  //   const bio$ = this.profileService.bio$.subscribe((user_bio) => {
  //     this.bio = user_bio;
  //   });
  //   const avatar_url$ = this.profileService.avatarUrl$.subscribe(
  //     (user_avatar_url) => {
  //       this.avatar_url = user_avatar_url;
  //     }
  //   );

  //   this.supabaseService.addProfile(this.username, this.bio, this.avatar_url);
  // }
  async onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // 1. Preview (Local)
  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrl = reader.result as string;
    this.profile_picture.get('profile_picture')?.setValue('done');
  };
  reader.readAsDataURL(file);

  // 2. Upload
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await this.supabaseService.client.storage
    .from('avatars')
    .upload(fileName, file);

  if (error) return console.error(error.message);

  // 3. GET THE ACTUAL URL
  const { data: urlData } = this.supabaseService.client.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Store the FULL URL in the service, not just the name
  this.profileService.updateAvatarUrl(urlData.publicUrl);

  // 4. Move Stepper
  const nativeMatStepper = document.querySelector('mat-stepper');
  (nativeMatStepper as any).next();
}

async done() {
  // Instead of subscribing, pull values directly from the forms/service 
  // to ensure they aren't undefined when addProfile is called.
  const name = this.username_group.get('username')?.value || '';
  const bio = this.bio_group.get('bio')?.value || '';
  
  // Get the last value emitted by the avatarUrl subject
  let avatar = '';
  this.profileService.avatarUrl$.subscribe(url => avatar = url).unsubscribe();

  const success = await this.supabaseService.addProfile(name, bio, avatar);

  if (success) {
    this.notify.show('Profile created successfully!');
    this.router.navigate(['/layout/user-stats']); // Redirect to the "default" page
  } else {
    this.notify.show('Error saving profile.');
  }
}
}
