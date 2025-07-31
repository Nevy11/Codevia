import { Component, inject, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TopLoginSignupComponent } from '../top-login-signup/top-login-signup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseClientService } from '../supabase-client.service';

@Component({
  selector: 'nevy11-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TopLoginSignupComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private supabase = inject(SupabaseClientService);
  loginForm = signal({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });
  toSignUp() {
    this.router.navigate(['/signup']);
  }
  // password field
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  async login() {
    const email = this.loginForm().email.value!;
    const password = this.loginForm().password.value!;
    if (!this.loginForm().email.valid || !this.loginForm().password.valid) {
      this.snackbar.open('Invalid credentials', 'Close', { duration: 3000 });
      return;
    }
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });
    // Logic for login can be added here
    if (error) {
      console.error('Login error:', error.message);
      this.snackbar.open(error.message, 'Close', { duration: 3000 });
    } else {
      this.snackbar.open('Login Successful', 'Close', { duration: 3000 });
      this.router.navigate(['/layout/home']);
    }
  }
}
