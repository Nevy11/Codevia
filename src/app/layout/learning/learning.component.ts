import { Component } from '@angular/core';
import { VideoSectionComponent } from './video-section/video-section.component';
import { CodeEditorSectionComponent } from './code-editor-section/code-editor-section.component';
import { ActivatedRoute } from '@angular/router';
import { VideoFeedComponent } from '../courses/video-feed/video-feed.component';

@Component({
  selector: 'nevy11-learning',
  imports: [
    VideoSectionComponent,
    CodeEditorSectionComponent,
    VideoFeedComponent,
  ],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
})
export class LearningComponent {
  videoId = 'rQ_J9WH6CGk';
  playbackSpeed = parseFloat(localStorage.getItem('playbackSpeed') || '1.0');
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.videoId = params['video'] || 'rQ_J9WH6CGk';
    });
  }
}
