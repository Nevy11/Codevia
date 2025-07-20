import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'nevy11-video-promo',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, NgOptimizedImage],
  templateUrl: './video-promo.component.html',
  styleUrl: './video-promo.component.scss',
})
export class VideoPromoComponent {
  // showVideo = false;
  // showCTA = false;

  // playVideo() {
  //   this.showVideo = true;
  //   setTimeout(() => {
  //     this.showCTA = true;
  //   }, 5000); // Show CTA after 5 seconds
  // }

  // closeVideo() {
  //   this.showVideo = false;
  //   this.showCTA = false;
  // }
  private dialog = inject(MatDialog);
  openVideo(): void {
    console.log('Opening video dialog');
    this.dialog.open(VideoDialogComponent, {
      width: '80%',
      height: '80%',
      panelClass: 'video-dialog',
    });
  }
}
