import { Component, inject, OnInit } from '@angular/core';
import { SupabaseClientService } from '../../../supabase-client.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VideoThumbnails } from '../video-thumbnails';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nevy11-courses-enrolled',
  imports: [MatCardModule, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './courses-enrolled.component.html',
  styleUrl: './courses-enrolled.component.scss',
})
export class CoursesEnrolledComponent implements OnInit {
  private supabaseService = inject(SupabaseClientService);
  private is_thumbnail_stored: Boolean = false;
  private userId: string | null = null;
  private is_courses_enrolled: boolean = false;
  videoThumbnails: VideoThumbnails[] | null = null;

  async ngOnInit(): Promise<void> {
    this.videoThumbnails = await this.supabaseService.getAllVideoThumbnails();
  }

  async playVideo(video: VideoThumbnails) {
    this.is_thumbnail_stored = await this.supabaseService.store_video_thumbnail(
      `${video.video_id}`,
      `${video.thumbnail_url}`
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
      // this.router.navigate(['/layout/learning'], {
      //   queryParams: { video: video.id },
      // });
    } else {
      console.error('Error while storing the thumbnail');
    }
  }
}
