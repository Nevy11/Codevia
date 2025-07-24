import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'nevy11-pre-footer',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './pre-footer.component.html',
  styleUrl: './pre-footer.component.scss',
})
export class PreFooterComponent {
  router = inject(Router);

  login() {
    console.log('Login button clicked');
    this.router.navigate(['login']);
  }
  signUp() {
    console.log('Sign Up button clicked');
    this.router.navigate(['signup']);
  }
}
