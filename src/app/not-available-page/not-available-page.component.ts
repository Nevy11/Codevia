import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'nevy11-not-available-page',
    imports: [MatButtonModule],
    templateUrl: './not-available-page.component.html',
    styleUrl: './not-available-page.component.scss'
})
export class NotAvailablePageComponent {
  router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
