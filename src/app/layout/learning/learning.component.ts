import {
  Component,
  ElementRef,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VideoSectionComponent } from './video-section/video-section.component';
import { CodeEditorSectionComponent } from './code-editor-section/code-editor-section.component';
import { ActivatedRoute } from '@angular/router';
import { VideoFeedComponent } from '../courses/video-feed/video-feed.component';
import { PythonProcessingComponent } from './code-editor-section/python-processing/python-processing.component';
import { LearningService } from './learning.service';
import { SupabaseClientService } from '../../supabase-client.service';
import { LoaderComponent } from '../../loader/loader.component';
import { EmotionalDetectionService } from '../../emotional-detection.service';

@Component({
  selector: 'nevy11-learning',
  imports: [
    VideoSectionComponent,
    CodeEditorSectionComponent,
    VideoFeedComponent,
    PythonProcessingComponent,
    LoaderComponent,
  ],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
})
export class LearningComponent implements OnInit, OnDestroy {
  videoId = 'rQ_J9WH6CGk';
  playbackSpeed = 1.0;
  learningService = inject(LearningService);
  supabaseService = inject(SupabaseClientService);
  loadingshowYT: boolean = true;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  private emotionalService = inject(EmotionalDetectionService);
  private detectionInterval: any;
  currentEmotion: string = 'Detecting...';

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  async ngOnInit() {
    await this.learningService.loadShowYT();

    if (isPlatformBrowser(this.platformId)) {
      const speed = parseFloat(localStorage.getItem('playbackSpeed') || '1.0');
      this.playbackSpeed = speed;
    }

    this.route.queryParams.subscribe((params) => {
      this.videoId = params['video'] ?? null;
    });
    this.loadingshowYT = false;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.startCamera(), 0);
    }
  }
  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = stream;

      this.detectionInterval = setInterval(() => {
        this.captureAndDetect();
      }, 3000);
    } catch (err) {
      console.error('Camera access denied', err);
    }
  }

  captureAndDetect() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            this.emotionalService.detectEmotion(blob).subscribe({
              next: (res) => {
                this.currentEmotion = res.emotion;
                console.log('User is feeling:', res.emotion);
              },
              error: (err) => console.error('Detection error', err),
            });
          }
        },
        'image/jpeg',
        0.8,
      );
    }
  }

  ngOnDestroy() {
    // Stop the camera and the interval when leaving the page
    if (this.detectionInterval) clearInterval(this.detectionInterval);
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  }
}
