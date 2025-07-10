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
@Component({
  selector: 'nevy11-signup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
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
}
