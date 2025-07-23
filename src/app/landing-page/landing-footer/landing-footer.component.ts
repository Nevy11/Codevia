import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'nevy11-landing-footer',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss',
})
export class LandingFooterComponent {
  openLink(url: string) {
    window.open(url, '_blank');
  }
}
