import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlaybackSettingsService } from '../../settings/preferences-settings/playback-settings.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClientService } from '../../../supabase-client.service';
import { GetVideo } from './get-video';
import { VideoSaving } from './video-saving';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

declare var YT: any; // YouTube Player API

@Component({
  selector: 'nevy11-video-section',
  imports: [MatSnackBarModule],
  templateUrl: './video-section.component.html',
  styleUrl: './video-section.component.scss',
})
export class VideoSectionComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @Input() videoId: string | null = 'dQw4w9WgXcQ'; // Default video ID
  @Input() playbackSpeed: number = 1.0; // value from settings
  @ViewChild('youtubePlayer', { static: false }) youtubePlayer!: ElementRef;

  videoUrl!: SafeResourceUrl;
  player: any; // YouTube Player instance
  user_id: string = '';
  sanitizer = inject(DomSanitizer);
  private is_course_completed: boolean = false;
  private playbackService = inject(PlaybackSettingsService);
  private supabaseService = inject(SupabaseClientService);
  private snackBar = inject(MatSnackBar);

  updateVideoUrl(): void {
    if (this.videoId) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`
      );
    } else {
      this.videoUrl = '';
    }
  }

  private async setSafeUrl() {
    if (this.videoId) {
      const video_data: GetVideo = {
        userId: this.user_id,
        videoId: this.videoId,
      };
      // get saved time from Supabase
      const savedTime = await this.supabaseService.getVideoProgress(video_data);

      const url = `https://www.youtube.com/embed/${this.videoId}?start=${savedTime}&enablejsapi=1&autoplay=1&controls=1&modestbranding=1&rel=0`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  async ngOnInit(): Promise<void> {
    this.user_id = (await this.supabaseService.getCurrentUserId()) || '';
    console.log('User id: ', this.user_id);
    this.setSafeUrl();
    this.playbackService.speed$.subscribe((speed) => {
      this.playbackSpeed = speed;
      if (this.player) {
        this.player.setPlaybackRate(this.playbackSpeed);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoId']) {
      this.setSafeUrl();
      if (this.player) {
        this.player.loadVideoById(this.videoId);
      }
    }
    if (changes['playbackSpeed'] && this.player) {
      this.player.setPlaybackRate(this.playbackSpeed);
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if ((window as any).YT) {
      this.createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = () => this.createPlayer();
      this.loadYouTubeApi();
    }
  }

  private loadYouTubeApi() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);
  }

  async ngOnDestroy() {
    if (this.videoId) {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const currentTime = Math.floor(this.player.getCurrentTime());
        const video_data: VideoSaving = {
          userId: this.user_id,
          videoId: this.videoId,
          currentTime: currentTime,
        };
        await this.supabaseService.saveVideoProgress(video_data);
      }
    }
  }
  private async createPlayer() {
    const video_data: GetVideo = {
      userId: this.user_id,
      videoId: this.videoId!,
    };

    // fetch saved time from Supabase
    const savedTime = await this.supabaseService.getVideoProgress(video_data);

    this.player = new (window as any).YT.Player(
      this.youtubePlayer.nativeElement,
      {
        videoId: this.videoId,
        playerVars: {
          start: savedTime,
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.setPlaybackRate(this.playbackSpeed);
            this.startProgressTracking(); // 👈 Start tracking progress
          },
          onStateChange: async (event: any) => {
            if (event.data === YT.PlayerState.ENDED) {
              console.log('✅ Video finished!');

              await this.markCourseCompleted();
            }
          },
        },
      }
    );
  }

  private startProgressTracking() {
    const interval = setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();

        if (duration > 0) {
          const progress = (currentTime / duration) * 100;

          if (progress >= 98 && !this.is_course_completed) {
            console.log('🚀 User reached 98% of the video');
            this.markCourseCompleted();
            clearInterval(interval); // stop checking
          }
        }
      }
    }, 2000);
  }

  private async markCourseCompleted() {
    this.is_course_completed = await this.supabaseService.completeCourse();

    if (this.is_course_completed) {
      this.snackBar.open(`Congratulation for completing that course`, `Close`, {
        duration: 3000,
      });
    } else {
      console.error('❌ There was an issue saving completion');
      this.snackBar.open(`Error while updating completed course`, `Close`, {
        duration: 3000,
      });
    }
  }
}
