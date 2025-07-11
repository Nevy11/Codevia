import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
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
@Component({
  selector: 'nevy11-signup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  // Email form control with validation
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');
  constructor() {
    merge(this.email.valueChanges, this.email.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateErrorMessage();
      });
  }
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('Email is required');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Please enter a valid email address');
    } else {
      this.errorMessage.set('');
    }
  }
  // password form control with validation
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
  ]);
  passwordErrorMessage = signal('');
  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else if (this.password.hasError('minlength')) {
      this.passwordErrorMessage.set(
        'Password must be at least 6 characters long'
      );
    } else if (this.password.hasError('maxlength')) {
      this.passwordErrorMessage.set(
        'Password cannot be longer than 20 characters'
      );
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
}
