import { Component } from '@angular/core';
import { CourseListComponent } from './course-list/course-list.component';
import { VideoFeedComponent } from './video-feed/video-feed.component';

@Component({
  selector: 'nevy11-courses',
  imports: [CourseListComponent, VideoFeedComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {}
