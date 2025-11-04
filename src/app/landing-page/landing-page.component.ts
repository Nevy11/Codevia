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
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PreFooterComponent } from './pre-footer/pre-footer.component';
import { TopLoginSignupComponent } from '../top-login-signup/top-login-signup.component';

@Component({
  selector: 'nevy11-landing-page',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    VideoPromoComponent,
    LandingFooterComponent,
    TestimonialsComponent,
    PreFooterComponent,
    TopLoginSignupComponent,
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
    '/home_page/female_student.avif',
    '/home_page/chenes_focus.webp',
    '/home_page/image1.avif',
  ];
  currentImageIndex = 0;
  private intervalId: any;

  preloadImages() {
    // if (isPlatformBrowser(this.platformId)) {
    this.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    // }
  }

  ngOnInit() {
    // if (isPlatformBrowser(this.platformId)) {
    this.intervalId = setInterval(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.images.length;
    }, 5000);

    // Manually add scroll listener if in browser
    window.addEventListener('scroll', this.handleScroll);
    // }
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    this.showScrollIndicator = scrollTop < 300;
  };

  get currentBackground(): string {
    return `url(${this.images[this.currentImageIndex]})`;
  }
  login() {
    this.router.navigate(['/login']);
  }
  register() {
    this.router.navigate(['/signup']);
  }

  home() {
    this.router.navigate(['']);
  }

  // Scroll indicator functionality
  showScrollIndicator = true;
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(event: Event) {
  //   const scrollTop = (event.target as Document).documentElement.scrollTop;
  //   this.showScrollIndicator = scrollTop < 300; // Show indicator if scrolled less than 100px
  // }

  // previewVideos = [
  //   { url: '/home_page/video1.mp4' },
  //   { url: '/home_page/video2.mp4' },
  //   { url: '/home_page/video3.mp4' },
  // ];
}
