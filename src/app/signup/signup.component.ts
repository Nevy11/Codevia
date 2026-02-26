import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { TopLoginSignupComponent } from '../top-login-signup/top-login-signup.component';
import { SupabaseClientService } from '../supabase-client.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
@Component({
  selector: 'nevy11-signup',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TopLoginSignupComponent,
    MatSnackBarModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private router = inject(Router);
  supabase = inject(SupabaseClientService);
  private snackbar = inject(MatSnackBar);
  isEmailSent = signal(false);
  // form group for the signup form
  formSignUp = signal({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  // Add a control for the 6-digit token
tokenControl = new FormControl('', [Validators.required, Validators.minLength(6),
  Validators.maxLength(6)
]);
  // Email form control with validation
  // readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');
  confirmPasswordErrorMessage = signal('');
  is_course_init: boolean = false;
  constructor() {
    merge(
      this.formSignUp().email.valueChanges,
      this.formSignUp().email.statusChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateErrorMessage();
      });
  }
  updateErrorMessage() {
    if (this.formSignUp().email.hasError('required')) {
      this.errorMessage.set('Email is required');
    } else if (this.formSignUp().email.hasError('email')) {
      this.errorMessage.set('Please enter a valid email address');
    } else {
      this.errorMessage.set('');
    }
  }

  passwordErrorMessage = signal('');
  updatePasswordErrorMessage() {
    if (this.formSignUp().password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else if (this.formSignUp().password.hasError('minlength')) {
      this.passwordErrorMessage.set(
        'Password must be at least 6 characters long'
      );
    } else if (this.formSignUp().password.hasError('maxlength')) {
      this.passwordErrorMessage.set(
        'Password cannot be longer than 20 characters'
      );
    } else {
      this.passwordErrorMessage.set('');
    }
  }
  updateConfirmPasswordErrorMessage() {
    const password = this.formSignUp().password.value;
    const confirmPassword = this.formSignUp().confirmPassword.value;  
    if (this.formSignUp().confirmPassword.hasError('required')) {
      this.passwordErrorMessage.set('Confirm Password is required');
    } else if (password !== confirmPassword) {
      this.passwordErrorMessage.set('Passwords do not match');
    } else {
      this.passwordErrorMessage.set('');
    }
  }
  

  // method to handle hide and show password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  // async signUp() {
  //   if (this.formSignUp().email.valid && this.formSignUp().password.valid) {
  //     const email = this.formSignUp().email.value!;
  //     const password = this.formSignUp().password.value!;
  //     const redirect_url = environment.SUPABASE_REDIRECT_URL;
      
  //     const { data, error } = await this.supabase.client.auth.signUp({
  //       email,
  //       password,
  //       options: { emailRedirectTo: redirect_url },
  //     });
  //     if (error) {
  //       this.snackbar.open('SignUp Error', `Close`, { duration: 3000 });
  //       console.error('SignUp error: ', error.message);
  //     } else {
  //       this.snackbar.open("Please verify you're email to continue", `Close`, {
  //         duration: 6000,
  //       });
  //       this.isEmailSent.set(true);
  //       this.is_course_init = await this.supabase.first_time_enroll_0_course();
  //       if (this.is_course_init) {
  //         console.log('SignUp Successful: ', data);
  //         this.router.navigate(['/login']);
  //       } else {
  //         console.error('course init failed');
  //       }
  //     }
  //   } else {
  //     this.updateErrorMessage();
  //     this.updatePasswordErrorMessage();
  //   }
  // }

  async signUp() {
    if (this.formSignUp().email.valid && this.formSignUp().password.valid) {
      const email = this.formSignUp().email.value!;
      const password = this.formSignUp().password.value!;

      // We remove emailRedirectTo because we are using OTP tokens now
      const { data, error } = await this.supabase.client.auth.signUp({
        email,
        password,
      });

      if (error) {
        this.snackbar.open(error.message, 'Close', { duration: 3000 });
      } else {
        this.snackbar.open("Verification code sent to your email!", "Close", {
          duration: 6000,
        });
        
        // This switches the UI to show the Token Input field
        this.isEmailSent.set(true);
      }
    } else {
      this.updateErrorMessage();
      this.updatePasswordErrorMessage();
    }
}
  goToLogin() {
    this.router.navigate(['/login']);
  }
  // In your SignupComponent

  async resendVerification() {
    const email = this.formSignUp().email.value;
    if (!email) {
      this.snackbar.open('Please enter your email.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const success = await this.supabase.resendConfirmationEmail(email);

    if (success) {
      this.snackbar.open(
        'New verification link sent! Check your inbox (and spam folder).',
        'Close',
        {
          duration: 6000,
        }
      );
    } else {
      this.snackbar.open(
        'Failed to send verification link. Please try again.',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }
  async verifyOTP() {
  if (this.tokenControl.valid) {
    const email = this.formSignUp().email.value!;
    const token = this.tokenControl.value!;

    const { data, error } = await this.supabase.client.auth.verifyOtp({
      email,
      token,
      type: 'signup' // This is the key for email verification
    });

    if (error) {
      this.snackbar.open('Invalid or expired code', 'Close', { duration: 3000 });
      console.error('OTP Error:', error.message);
    } else {
      this.snackbar.open('Email verified successfully!', 'Close', { duration: 3000 });
      
      // Perform your course initialization now that they are verified
      this.is_course_init = await this.supabase.first_time_enroll_0_course();
      this.router.navigate(['/layout/home']); // Or wherever you want them to go
    }
  }
}
}
