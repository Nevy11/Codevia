import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TopLoginSignupComponent } from '../../../top-login-signup/top-login-signup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'nevy11-top-about',
  imports: [MatIconModule, MatButtonModule, TopLoginSignupComponent],
  templateUrl: './top-about.component.html',
  styleUrl: './top-about.component.scss',
})
export class TopAboutComponent {
  private router = inject(Router);
  signUp() {
    this.router.navigate(['signup']);
  }
}
