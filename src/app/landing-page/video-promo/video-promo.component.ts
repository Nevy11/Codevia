import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'nevy11-video-promo',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './video-promo.component.html',
  styleUrl: './video-promo.component.scss',
})
export class VideoPromoComponent {
  showVideo = false;
  showCTA = false;

  playVideo() {
    this.showVideo = true;
    setTimeout(() => {
      this.showCTA = true;
    }, 5000); // Show CTA after 5 seconds
  }

  closeVideo() {
    this.showVideo = false;
    this.showCTA = false;
  }
}
