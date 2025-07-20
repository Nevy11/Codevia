import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'nevy11-video-dialog',
  imports: [MatButtonModule],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  standalone: true,
})
export class VideoDialogComponent implements OnInit {
  ctaVisible = false;
  ngOnInit(): void {
    // Show the CTA after 5 seconds
    setTimeout(() => {
      this.ctaVisible = true;
    }, 5000);
  }
}
