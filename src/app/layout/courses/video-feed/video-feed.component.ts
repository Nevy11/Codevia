import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { YoutubeService } from '../../youtube.service';

@Component({
  selector: 'nevy11-video-feed',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './video-feed.component.html',
  styleUrl: './video-feed.component.scss',
})
export class VideoFeedComponent implements OnInit {
  private router = inject(Router);
  private youtube = inject(YoutubeService);

  videos: any[] = [];

  ngOnInit() {
    this.youtube.getVideos('full course').subscribe((data) => {
      this.videos = data;
    });
  }

  playVideo(video: any) {
    this.router.navigate(['/layout/learning'], {
      queryParams: { video: video.id },
    });
  }
}
