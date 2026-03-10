import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Courses } from './courses';
import { SupabaseClientService } from '../../supabase-client.service';
import { MatIconModule } from '@angular/material/icon';
import { CoursesEnrolledComponent } from './courses-enrolled/courses-enrolled.component';
import { from, of, switchMap } from 'rxjs';
import { LoaderComponent } from '../../loader/loader.component';

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
    LoaderComponent
  ],
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.scss',
})
export class UserStatsComponent implements OnInit {
  totalCoursesEnrolled = 0;
  coursesCompleted = 0;
  completionRate = 0;
  lastActiveDate = new Date('2025-08-20');
  mostWatchedCourse = 'Angular Basics';
  averageWatchDuration = 0; // minutes per video
  videoThumbnails: Courses[] | null = null;
  isLoading: boolean=true;
  private supabaseService = inject(SupabaseClientService);
  userId$ = from(this.supabaseService.getCurrentUserId());

  stats$ = this.userId$.pipe(
    switchMap((userId) => {
      if (!userId) return of(null);
      return from(this.supabaseService.getCourseStats(userId));
    }),
  );
  videos: any[] = [];

  courseStats: any[] = [
    
  ];

  
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try{
      // 1. Fetch real course metadata
      this.videoThumbnails = await this.supabaseService.getAllCourses();

      // 2. Fetch the 3 most recently watched videos/courses
      const recentProgress = await this.supabaseService.getRecentUserProgress(3);

      if (recentProgress && recentProgress.length > 0) {
        let totalMinutesAcrossAll = 0;

        // 3. Map the Supabase data to your UI structure
        this.courseStats = recentProgress.map((item) => {
          const recordDate = new Date(item.updated_at);
          if (recordDate > this.lastActiveDate) {
            this.lastActiveDate = recordDate;
          }

          const minutesSpent = Math.round(item.playback_position / 60);
          totalMinutesAcrossAll += minutesSpent; // Accumulate for average

          return {
            courseName: item.courses?.title || 'Unknown Course',
            progress: item.playback_position > 0 ? 50 : 0, 
            totalWatchTime: minutesSpent,
            thumbnail: item.courses?.thumbnail_url,
            lastWatched: item.updated_at,
          };
        });

        // 4. Calculate Average Watch Duration
        // This takes the total time spent in these sessions divided by the number of sessions
        this.averageWatchDuration = Math.round(totalMinutesAcrossAll / recentProgress.length);
        
        // Optional: Update 'Most Watched' based on the top record
        if (this.courseStats.length > 0) {
            this.mostWatchedCourse = this.courseStats[0].courseName;
        }
      }
    }catch(error){
      console.error('Error fetching stats:', error);
    }finally{
      this.isLoading = false;
    }

    // Keep your stats$ subscription for completion rate...
    this.stats$.subscribe((stats) => {
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
