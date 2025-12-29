import { Component, HostListener, inject, OnInit } from '@angular/core';
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
  styleUrls: ['./video-feed.component.scss'],
})
export class VideoFeedComponent implements OnInit {
  private router = inject(Router);
  private youtube = inject(YoutubeService);
  private supabaseService = inject(SupabaseClientService);
  private is_thumbnail_stored: Boolean = false;
  private userId: string | null = null;
  private is_courses_enrolled: boolean = false;

  videos: any[] = [];
  limit = 10;
  offset = 0;
  loading = false;

  ngOnInit() {
    this.loadCourses();
  }

  async loadCourses() {
    if (this.loading) return;
    this.loading = true;

    const courses = await this.supabaseService.getAllCourses(
      this.limit,
      this.offset
    );

    if (courses) {
      this.videos.push(
        ...courses.map((course) => ({
          id: course.video_id,
          title: course.title,
          thumbnailUrl: course.thumbnail_url,
        }))
      );
      this.offset += this.limit;
    } else {
      console.error('VideoFeed: failed to load videos');
    }

    this.loading = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.loading
    ) {
      this.loadCourses();
    }
  }

  async playVideo(video: any) {
    const isCourseCreated = await this.supabaseService.createCourse(
      video.id,
      video.thumbnailUrl,
      video.title,
      ''
    );

    if (isCourseCreated) {
      console.log('Course created');
      this.userId = await this.supabaseService.getCurrentUserId();
      if (this.userId) {
        this.is_courses_enrolled = await this.supabaseService.enrollCourse(
          this.userId,
          video.id
        );
        if (this.is_courses_enrolled) {
          console.log('The course was updated successfully');
        } else {
          console.error('failed to update the course');
        }
      } else {
        console.error('Failed to upload the number of courses enrolled');
      }
      const saved_video = await this.supabaseService.saveCurrentVideo(video.id);

      if (!saved_video) {
        console.error('Failed to save the selected video');
        return;
      }

      this.router.navigate(['/layout/learning'], {
        queryParams: { video: video.id },
      });
      console.log('Navigating to video:', video.id);
    } else {
      console.error('Error while creating the course');
    }
  }
}
