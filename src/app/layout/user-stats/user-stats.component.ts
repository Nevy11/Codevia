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

  courseStats: CourseStat[] = [
    {
      courseName: 'Angular Basics',
      totalVideos: 10,
      watchedVideos: 10,
      progress: 100,
      totalWatchTime: 120,
    },
    {
      courseName: 'Rust for Beginners',
      totalVideos: 8,
      watchedVideos: 5,
      progress: 62,
      totalWatchTime: 60,
    },
    {
      courseName: 'AI with PyTorch',
      totalVideos: 12,
      watchedVideos: 6,
      progress: 50,
      totalWatchTime: 80,
    },
  ];

  async ngOnInit(): Promise<void> {
    this.completionRate = Math.round(
      (this.coursesCompleted / this.totalCoursesEnrolled) * 100
    );
    this.videoThumbnails = await this.supabaseService.getAllCourses();
  }
}
