import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { NotificiationService } from '../../../../notification.service';
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
export class MobileStepperComponent implements OnInit{
  private _formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private supabaseService = inject(SupabaseClientService);
  private notify = inject(NotificiationService);
  private router = inject(Router);
  imageUrl: string = '';

  @ViewChild('stepper') stepper: any;
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

  ngOnInit(): void {
    this.profileService.avatarUrl$.subscribe((url) => {
      this.imageUrl = url;
      this.avatar_url = url; // Sync your internal submission variable
    });
  }

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
 
//   async onFileSelected(event: Event) {
//   const file = (event.target as HTMLInputElement).files?.[0];
//   if (!file) return;

//   // 1. Preview (Local)
//   const reader = new FileReader();
//   reader.onload = () => {
//     this.previewUrl = reader.result as string;
//     this.profile_picture.get('profile_picture')?.setValue('done');
//   };
//   reader.readAsDataURL(file);

//   // 2. Upload
//   const fileName = `${Date.now()}-${file.name}`;
//   const { data, error } = await this.supabaseService.client.storage
//     .from('avatars')
//     .upload(fileName, file);

//   if (error) return console.error(error.message);

//   // 3. GET THE ACTUAL URL
//   const { data: urlData } = this.supabaseService.client.storage
//     .from('avatars')
//     .getPublicUrl(fileName);

//   // Store the FULL URL in the service, not just the name
//   this.profileService.updateAvatarUrl(urlData.publicUrl);

//   // 4. Move Stepper
//   // const nativeMatStepper = document.querySelector('mat-stepper');
//   // (nativeMatStepper as any).next();
//   if (this.stepper) {
//     this.stepper.next();
//   }
// }

// async done() {
//   // Instead of subscribing, pull values directly from the forms/service 
//   // to ensure they aren't undefined when addProfile is called.
//   const name = this.username_group.get('username')?.value || '';
//   const bio = this.bio_group.get('bio')?.value || '';
  
//   // Get the last value emitted by the avatarUrl subject
//   let avatar = '';
//   this.profileService.avatarUrl$.subscribe(url => avatar = url).unsubscribe();

//   const success = await this.supabaseService.addProfile(name, bio, avatar);

//   if (success) {
//     this.notify.show('Profile created successfully!');
//     this.router.navigate(['/layout/user-stats']); // Redirect to the "default" page
//   } else {
//     this.notify.show('Error saving profile.');
//   }
// }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // 1. Get current user ID (Matching your Settings logic)
    const { data: { user } } = await this.supabaseService.client.auth.getUser();
    if (!user) {
      console.error('No user found');
      return;
    }

    // 2. Preview (Local)
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.profile_picture.get('profile_picture')?.setValue('done');
    };
    reader.readAsDataURL(file);

    // 3. Upload using User ID (with upsert to overwrite old attempts)
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error } = await this.supabaseService.client.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Crucial: updates existing instead of failing
      });

    if (error) {
      console.error('Upload error:', error.message);
      return;
    }

    // 4. Get Public URL and update the service
    const { data: urlData } = this.supabaseService.client.storage
      .from('avatars')
      .getPublicUrl(fileName);

    this.imageUrl = urlData.publicUrl; // Update local property
    this.profileService.updateAvatarUrl(urlData.publicUrl);

    // 5. Move Stepper
    if (this.stepper) {
      this.stepper.next();
    }
  }

  async done() {
    const name = this.username_group.get('username')?.value || '';
    const bio = this.bio_group.get('bio')?.value || '';
    
    // Safely get the latest URL from the service
    let avatar = '';
    const sub = this.profileService.avatarUrl$.subscribe(url => avatar = url);
    sub.unsubscribe(); // Immediate unsubscribe after getting value

    // If for some reason the service is empty, fallback to the local previewUrl
    const finalAvatar = avatar || this.previewUrl || '';

    const success = await this.supabaseService.addProfile(name, bio, finalAvatar);

    if (success) {
      this.notify.show('Profile created successfully!');
      this.router.navigate(['/layout/home']);
    } else {
      this.notify.show('Error saving profile.');
    }
}
}
