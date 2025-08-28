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
    this.router.navigate(['login']);
  }
  signUp() {
    this.router.navigate(['signup']);
  }
}
