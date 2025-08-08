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

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // 1. Upload to Supabase Storage
    // const fileName = `avatars/${Date.now()}-${file.name}`;
    const fileName = `${Date.now()}-${file.name}`;

    console.log(`File name selected: ${fileName}`);
    // const { data, error } = await this.supabaseService.client.storage
    //   .from('avatars') // Make sure you created "avatars" bucket in Supabase
    //   .upload(fileName, file, { upsert: true });

    // if (error) {
    //   console.error('Avatar upload error:', error);
    //   return;
    // }

    // 2. Get the public URL for the avatar
    // const { data: publicUrlData } = this.supabaseService.client.storage
    //   .from('avatars')
    //   .getPublicUrl(fileName);

    // const avatarUrl = publicUrlData?.publicUrl || '';

    // 3. Update profile with Supabase URL
    // const updated_image: Profile = {
    //   name: this.profile.name,
    //   email: this.profile.email,
    //   bio: this.profile.bio,
    //   avatarUrl,
    // };
    // await this.profileService.updateProfile(updated_image);
  }
}
