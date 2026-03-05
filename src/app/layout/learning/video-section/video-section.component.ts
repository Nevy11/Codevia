import {
  AfterViewInit,
  ChangeDetectorRef,
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
import { ActivatedRoute } from '@angular/router';

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

  @Input() videoId: string | null = null;
  // 'dQw4w9WgXcQ'; // Default video ID
  @Input() playbackSpeed: number = 1.0; // value from settings
  @ViewChild('youtubePlayer', { static: false }) youtubePlayer!: ElementRef;

  videoUrl!: SafeResourceUrl;
  player: any; // YouTube Player instance
  user_id: string = '';
  sanitizer = inject(DomSanitizer);
  my_videos: any[] = [];
  private is_course_completed: boolean = false;
  private playbackService = inject(PlaybackSettingsService);
  private supabaseService = inject(SupabaseClientService);
  private snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  cdr = inject(ChangeDetectorRef);

  
  private async setSafeUrl() {
    if (this.videoId) {
      const video_data: GetVideo = {
        userId: this.user_id,
        videoId: this.videoId,
      };
      const savedTime = await this.supabaseService.getVideoProgress(video_data);

      // CRITICAL: origin and enablejsapi are required for the API to work with a hardcoded iframe
      const origin = window.location.origin;
      const url = `https://www.youtube.com/embed/${this.videoId}?start=${savedTime}&enablejsapi=1&origin=${origin}&autoplay=1&rel=0`;
      
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.user_id = (await this.supabaseService.getCurrentUserId()) || '';

    this.route.queryParams.subscribe(async (params) => {
      const paramVideoId = params['video'];

      if (paramVideoId) {
        // 1. Prioritize the URL parameter (what the user just clicked)
        this.videoId = paramVideoId;
        console.log('Playing clicked video:', this.videoId);
      } else {
        // 2. No param? Try to get last watched from Supabase
        const my_videos = await this.supabaseService.getUserVideos();
        
        if (my_videos && my_videos.length > 0) {
          this.videoId = my_videos[my_videos.length - 1].video_id;
          console.log('Playing last watched:', this.videoId);
        } else {
          // 3. Absolute last resort fallback
          this.videoId = 'dQw4w9WgXcQ'; 
          console.log('No history found, using fallback');
        }
      }

      // Update the URL and tell Angular to refresh the view
      await this.setSafeUrl();
      this.cdr.detectChanges();

      // If the player is already initialized, force it to load the new ID
      if (this.player && typeof this.player.loadVideoById === 'function') {
        this.player.loadVideoById(this.videoId);
      }
    });
  }
 

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoId'] && this.videoId) {
      // Only call loadVideoById if the player API has actually connected
      if (this.player && typeof this.player.loadVideoById === 'function') {
        this.player.loadVideoById(this.videoId);
      } else {
        // If player isn't ready yet, setSafeUrl will handle the initial load via [src]
        if (!isPlatformBrowser(this.platformId)) return;
        this.setSafeUrl();
      }
    }
    
    if (changes['playbackSpeed'] && this.player?.setPlaybackRate) {
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
    if (!this.youtubePlayer || !this.videoId) return;

    // Instead of creating a NEW player, we "bind" to the existing iframe
    this.player = new (window as any).YT.Player(this.youtubePlayer.nativeElement, {
      events: {
        onReady: (event: any) => {
          console.log('API attached to existing iframe');
          event.target.setPlaybackRate(this.playbackSpeed);
          this.startProgressTracking();
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.ENDED) {
            this.markCourseCompleted();
          }
        },
        onError: (event: any) => {
          console.error('YouTube Player Error:', event.data);
        }
      }
    });
  }
  private startProgressTracking() {
    const interval = setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();

        if (duration > 0) {
          const progress = (currentTime / duration) * 100;

          if (progress >= 98 && !this.is_course_completed) {
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
      console.error(' There was an issue saving completion');
      this.snackBar.open(`Error while updating completed course`, `Close`, {
        duration: 3000,
      });
    }
  }
  async clear_save_time() {
    if (this.videoId) {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        const currentTime = Math.floor(1);
        const video_data: VideoSaving = {
          userId: this.user_id,
          videoId: this.videoId,
          currentTime: currentTime,
        };
        await this.supabaseService.saveVideoProgress(video_data);
      }
    }
  }
}
