import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlaybackSettingsService } from '../../settings/preferences-settings/playback-settings.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var YT: any; // YouTube Player API

@Component({
  selector: 'nevy11-video-section',
  imports: [],
  templateUrl: './video-section.component.html',
  styleUrl: './video-section.component.scss',
})
export class VideoSectionComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @Input() videoId: string | null = 'dQw4w9WgXcQ'; // Default video ID
  @Input() playbackSpeed: number = 1.0; // value from settings
  @ViewChild('youtubePlayer', { static: false }) youtubePlayer!: ElementRef;

  videoUrl!: SafeResourceUrl;
  private player: any; // YouTube Player instance
  sanitizer = inject(DomSanitizer);
  private playbackService = inject(PlaybackSettingsService);

  updateVideoUrl(): void {
    if (this.videoId) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`
      );
    } else {
      this.videoUrl = '';
    }
  }

  private setSafeUrl() {
    const url = `https://www.youtube.com/embed/${this.videoId}?enablejsapi=1&autoplay=1&controls=1&modestbranding=1&rel=0`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  ngOnInit(): void {
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

  // ngAfterViewInit(): void {
  //   (window as any).onYouTubeIframeAPIReady = () => {
  //     this.player = new YT.Player(this.youtubePlayer.nativeElement, {
  //       videoId: this.videoId,
  //       events: {
  //         onReady: (event: any) => {
  //           event.target.setPlaybackRate(this.playbackSpeed);
  //         },
  //       },
  //     });
  //   };
  // }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).onYouTubeIframeAPIReady = () => {
        this.player = new YT.Player(this.youtubePlayer.nativeElement, {
          videoId: this.videoId,
          events: {
            onReady: (event: any) => {
              event.target.setPlaybackRate(this.playbackSpeed);
            },
          },
        });
      };
    }
  }
}
