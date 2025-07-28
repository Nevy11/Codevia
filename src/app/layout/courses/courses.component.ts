import { Component } from '@angular/core';
import { VideoFeedComponent } from './video-feed/video-feed.component';

@Component({
  selector: 'nevy11-courses',
  imports: [VideoFeedComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {}
