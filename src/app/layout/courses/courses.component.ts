import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoFeedComponent } from './video-feed/video-feed.component';

@Component({
  selector: 'nevy11-courses',
  standalone: true,
  imports: [CommonModule, VideoFeedComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {}
