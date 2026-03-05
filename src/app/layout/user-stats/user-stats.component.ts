import { Component, inject, OnInit } from '@angular/core';
import { CourseStat } from './course-stat';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Courses } from './courses';
import { SupabaseClientService } from '../../supabase-client.service';
import { YoutubeService } from '../youtube.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CoursesEnrolledComponent } from './courses-enrolled/courses-enrolled.component';
import { from, of, switchMap } from 'rxjs';

@Component({
  selector: 'nevy11-user-stats',
  imports: [
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    DatePipe,
    MatIconModule,
    CoursesEnrolledComponent,
    AsyncPipe,
  ],
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.scss',
})
export class UserStatsComponent implements OnInit {
  totalCoursesEnrolled = 5;
  coursesCompleted = 3;
  completionRate = 0;
  lastActiveDate = new Date('2025-08-20');
  mostWatchedCourse = 'Angular Basics';
  averageWatchDuration = 12; // minutes per video
  videoThumbnails: Courses[] | null = null;

  private supabaseService = inject(SupabaseClientService);
  userId$ = from(this.supabaseService.getCurrentUserId());

  stats$ = this.userId$.pipe(
    switchMap((userId) => {
      if (!userId) return of(null);
      return from(this.supabaseService.getCourseStats(userId));
    })
  );
  videos: any[] = [];

  courseStats: any[] = [
    // {
    //   courseName: 'Angular Basics',
    //   totalVideos: 10,
    //   watchedVideos: 10,
    //   progress: 100,
    //   totalWatchTime: 120,
    // },
    // {
    //   courseName: 'Rust for Beginners',
    //   totalVideos: 8,
    //   watchedVideos: 5,
    //   progress: 62,
    //   totalWatchTime: 60,
    // },
    // {
    //   courseName: 'AI with PyTorch',
    //   totalVideos: 12,
    //   watchedVideos: 6,
    //   progress: 50,
    //   totalWatchTime: 80,
    // },
  ];

  // async ngOnInit(): Promise<void> {
  //   this.completionRate = Math.round(
  //     (this.coursesCompleted / this.totalCoursesEnrolled) * 100
  //   );
  //   this.videoThumbnails = await this.supabaseService.getAllCourses();
  // }
  async ngOnInit(): Promise<void> {
    // 1. Fetch real course metadata
    this.videoThumbnails = await this.supabaseService.getAllCourses();

    // 2. Fetch the 3 most recently watched videos/courses
    const recentProgress = await this.supabaseService.getRecentUserProgress(3);

    // 3. Map the Supabase data to your UI structure
    this.courseStats = recentProgress.map(item => {
      // Assuming you want to show progress. 
      // Note: To get 'Total Videos', you'd need a more complex query, 
      // so for now, let's map what we have from the progress table.
      const recordDate = new Date(item.updated_at);
    if (recordDate > this.lastActiveDate) {
      this.lastActiveDate = recordDate;
    }
      return {
        courseName: item.courses?.title || 'Unknown Course',
        progress: item.playback_position > 0 ? 50 : 0, // Simplified logic
        totalWatchTime: Math.round(item.playback_position / 60), // Convert seconds to minutes
        thumbnail: item.courses?.thumbnail_url,
        lastWatched: item.updated_at
      };
    });

    // Calculate completion rate based on real stats if available
    this.stats$.subscribe(stats => {
      if (stats) {
        this.totalCoursesEnrolled = stats.enrolled;
        this.coursesCompleted = stats.completed;
        this.completionRate = this.totalCoursesEnrolled > 0 
          ? Math.round((this.coursesCompleted / this.totalCoursesEnrolled) * 100) 
          : 0;
      }
    });
  }
}
