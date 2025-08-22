import { Component, OnInit } from '@angular/core';
import { CourseStat } from './course-stat';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nevy11-user-stats',
  imports: [MatCardModule, MatTableModule, MatProgressBarModule, DatePipe],
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

  ngOnInit(): void {
    this.completionRate = Math.round(
      (this.coursesCompleted / this.totalCoursesEnrolled) * 100
    );
  }
}
