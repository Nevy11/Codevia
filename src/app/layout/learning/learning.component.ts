import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VideoSectionComponent } from './video-section/video-section.component';
import { CodeEditorSectionComponent } from './code-editor-section/code-editor-section.component';
import { ActivatedRoute } from '@angular/router';
import { VideoFeedComponent } from '../courses/video-feed/video-feed.component';
import { PythonProcessingComponent } from './code-editor-section/python-processing/python-processing.component';
import { LearningService } from './learning.service';
import { SupabaseClientService } from '../../supabase-client.service';

@Component({
  selector: 'nevy11-learning',
  imports: [
    VideoSectionComponent,
    CodeEditorSectionComponent,
    VideoFeedComponent,
    PythonProcessingComponent,
  ],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
})
export class LearningComponent {
  videoId = 'rQ_J9WH6CGk';
  playbackSpeed = 1.0;
  learningService = inject(LearningService);
  supabaseService = inject(SupabaseClientService);
  showYT$ = this.learningService.get_show_yt();

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async ngOnInit() {
    await this.learningService.loadShowYT();

    if (isPlatformBrowser(this.platformId)) {
      const speed = parseFloat(localStorage.getItem('playbackSpeed') || '1.0');
      this.playbackSpeed = speed;
    }

    this.route.queryParams.subscribe((params) => {
      this.videoId = params['video'] || 'rQ_J9WH6CGk';
    });
  }
}
