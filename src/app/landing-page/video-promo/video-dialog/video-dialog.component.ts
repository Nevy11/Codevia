import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrlPipe } from './safe-url.pipe';
@Component({
  selector: 'nevy11-video-dialog',
  imports: [MatButtonModule, SafeUrlPipe],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  standalone: true,
})
export class VideoDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {}
  ctaVisible = false;
  ngOnInit(): void {
    // Show the CTA after 5 seconds
    setTimeout(() => {
      this.ctaVisible = true;
    }, 5000);
  }
}
