import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TopLoginSignupComponent } from '../../../top-login-signup/top-login-signup.component';

@Component({
  selector: 'nevy11-top-about',
  imports: [MatIconModule, MatButtonModule, TopLoginSignupComponent],
  templateUrl: './top-about.component.html',
  styleUrl: './top-about.component.scss',
})
export class TopAboutComponent {}
