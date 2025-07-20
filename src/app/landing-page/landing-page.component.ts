import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  HostListener,
} from '@angular/core';
import { map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { VideoPromoComponent } from './video-promo/video-promo.component';

@Component({
  selector: 'nevy11-landing-page',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    VideoPromoComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // rendering different images
  images = [
    '/home_page/image3.jpg',
    '/home_page/strong.png',
    '/home_page/image4.jpeg',
    '/home_page/image1.avif',
  ];
  currentImageIndex = 0;
  private intervalId: any;

  preloadImages() {
    this.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  ngOnInit() {
    this.preloadImages();
    if (isPlatformBrowser(this.platformId)) {
      // Start the interval only if the platform is a browser
      this.intervalId = setInterval(() => {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % this.images.length;
      }, 5000);
    }
  }
  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            mobile_device: true,
          },
        ];
      } else {
        // tablet potrait view
        const isTabletPotrait = this.breakpointObserver.isMatched(
          Breakpoints.TabletPortrait
        );
        if (isTabletPotrait) {
          return [
            {
              mobile_device: false,
            },
          ];
        } else {
          // small laptop view
          const isSmallLaptop = this.breakpointObserver.isMatched(
            '(min-width: 840px) and (max-width: 1366px)'
          );
          if (isSmallLaptop) {
            return [
              {
                mobile_device: false,
              },
            ];
          } else {
            return [
              {
                mobile_device: false,
              },
            ];
            // Large laptop view
          }
        }
      }
    })
  );

  get currentBackground(): string {
    return `url(${this.images[this.currentImageIndex]})`;
  }
  login() {
    this.router.navigate(['/login']);
  }
  register() {
    this.router.navigate(['/signup']);
  }

  // Scroll indicator functionality
  showScrollIndicator = true;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollTop = (event.target as Document).documentElement.scrollTop;
    this.showScrollIndicator = scrollTop < 300; // Show indicator if scrolled less than 100px
  }

  previewVideos = [
    { url: '/home_page/video1.mp4' },
    { url: '/home_page/video2.mp4' },
    { url: '/home_page/video3.mp4' },
  ];
}
