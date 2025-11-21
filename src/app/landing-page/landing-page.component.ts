
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    VideoPromoComponent,
    LandingFooterComponent,
    TestimonialsComponent,
    PreFooterComponent,
    TopLoginSignupComponent
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private router = inject(Router);

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
    this.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.images.length;
    }, 5000);

    // Manually add scroll listener if in browser
    window.addEventListener('scroll', this.handleScroll);
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('scroll', this.handleScroll);
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

  showScrollIndicator = true;
}
