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
      id: 'dQw4w9WgXcQ',
      title: 'Sample Video 1',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
    },
    {
      id: '3JZ_D3ELwOQ',
      title: 'Sample Video 2',
      thumbnailUrl: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/0.jpg',
    },
    {
      id: '9bZkp7q19f0',
      title: 'Sample Video 3',
      thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/0.jpg',
    },
  ];
  playVideo(video: Video) {
    // Navigate to learning section, passing video ID as parameter
    this.router.navigate(['/layout/learning'], {
      queryParams: { video: video.id },
    });
  }
}
