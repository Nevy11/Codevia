import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { YoutubeService } from '../../youtube.service';
import { SupabaseClientService } from '../../../supabase-client.service';

@Component({
  selector: 'nevy11-video-feed',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './video-feed.component.html',
  styleUrl: './video-feed.component.scss',
})
export class VideoFeedComponent implements OnInit {
  private router = inject(Router);
  private youtube = inject(YoutubeService);
  private supabaseService = inject(SupabaseClientService);
  private is_thumbnail_stored: Boolean = false;
  private userId: string | null = null;
  private is_courses_enrolled: boolean = false;

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
        this.is_courses_enrolled = await this.supabaseService.enrollCourse(
          this.userId
        );
        if (this.is_courses_enrolled) {
          console.log('The course was updated successfully');
        } else {
          console.error('failed to update the course');
        }
      } else {
        console.error('Failed to upload the number of courses enrolled');
      }
      this.router.navigate(['/layout/learning'], {
        queryParams: { video: video.id },
      });
      console.log('Navigating to video:', video.id);
    } else {
      console.error('Error while storing the thumbnail');
    }
  }
}
