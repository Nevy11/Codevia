import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'nevy11-video-section',
  imports: [],
  templateUrl: './video-section.component.html',
  styleUrl: './video-section.component.scss',
})
export class VideoSectionComponent implements OnChanges, OnInit {
  @Input() videoId: string | null = 'dQw4w9WgXcQ'; // Default video ID
  // videoId: string | null = 'dQw4w9WgXcQ';
  videoUrl!: SafeResourceUrl;
  sanitizer = inject(DomSanitizer);
  ngOnInit(): void {
    console.log(
      'VideoSectionComponent initialized with videoId:',
      this.videoId
    );
    this.setSafeUrl();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['videoId'] && this.videoId) {
    //   console.log('Video ID changed:', this.videoId);
    //   this.updateVideoUrl();
    // }
    // const url = `https://www.youtube.com/embed/${this.videoId}`;
    // this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    if (changes['videoId']) {
      this.setSafeUrl();
    }
  }
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
    const url = `https://www.youtube.com/embed/${this.videoId}`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
