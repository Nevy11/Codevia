import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { YoutubeService } from '../../youtube.service';
import { SupabaseClientService } from '../../../supabase-client.service';

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
  private supabaseService = inject(SupabaseClientService);
  is_thumbnail_stored: Boolean = false;
  private userId: string | null = null;

  videos: any[] = [];

  ngOnInit() {
    this.youtube.getVideos('full course').subscribe((data) => {
      this.videos = data;
    });
  }

  async playVideo(video: any) {
    this.is_thumbnail_stored = await this.supabaseService.store_video_thumbnail(
      `${video.title}`,
      `${video.thumbnailUrl}`
    );
    if (this.is_thumbnail_stored) {
      console.log('Thumbnail stored');
      this.userId = await this.supabaseService.getCurrentUserId();
      if (this.userId) {
        this.supabaseService.enrollCourse(this.userId);
      }
      this.router.navigate(['/layout/learning'], {
        queryParams: { video: video.id },
      });
    } else {
      console.error('Error while storing the thumbnail');
    }
  }
}
