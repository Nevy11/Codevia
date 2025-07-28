import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from './video';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'nevy11-video-feed',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './video-feed.component.html',
  styleUrl: './video-feed.component.scss',
})
export class VideoFeedComponent {
  private router = inject(Router);
  videos: Video[] = [
    {
      id: 'rQ_J9WH6CGk',
      title: 'Sample Video 1',
      thumbnailUrl: 'https://img.youtube.com/vi/rQ_J9WH6CGk/0.jpg',
    },
    {
      id: 'rfscVS0vtbw',
      title: 'Sample Video 2',
      thumbnailUrl: 'https://img.youtube.com/vi/rfscVS0vtbw/0.jpg',
    },
    {
      id: 'PkZNo7MFNFg',
      title: 'Sample Video 3',
      thumbnailUrl: 'https://img.youtube.com/vi/PkZNo7MFNFg/0.jpg',
    },
  ];
  playVideo(video: Video) {
    // Navigate to learning section, passing video ID as parameter
    this.router.navigate(['/layout/learning'], {
      queryParams: { video: video.id },
    });
  }
}
