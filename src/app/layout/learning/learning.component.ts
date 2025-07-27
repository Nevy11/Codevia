import { Component } from '@angular/core';
import { VideoSectionComponent } from './video-section/video-section.component';
import { CodeEditorSectionComponent } from './code-editor-section/code-editor-section.component';

@Component({
  selector: 'nevy11-learning',
  imports: [VideoSectionComponent, CodeEditorSectionComponent],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
})
export class LearningComponent {}
