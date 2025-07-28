import { Component } from '@angular/core';
import { VideoSectionComponent } from './video-section/video-section.component';
import { CodeEditorSectionComponent } from './code-editor-section/code-editor-section.component';
import { CourseListComponent } from '../courses/course-list/course-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nevy11-learning',
  imports: [
    VideoSectionComponent,
    CodeEditorSectionComponent,
    CourseListComponent,
  ],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
})
export class LearningComponent {
  videoId = 'dQw4w9WgXcQ';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.videoId = params['video'] || 'dQw4w9WgXcQ';
    });
  }
}
