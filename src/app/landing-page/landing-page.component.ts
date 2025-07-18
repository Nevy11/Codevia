import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'nevy11-landing-page',
  imports: [CommonModule, MatToolbarModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // rendering different images
  images = [
    '/home_page/resized_pytorch.png',
    '/home_page/cool.jpeg',
    '/home_page/resized_tf.png',
    '/home_page/download.jpeg',
  ];
  currentImageIndex = 0;
  private intervalId: any;
  ngOnInit() {
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
      } else {
        // tablet potrait view
        const isTabletPotrait = this.breakpointObserver.isMatched(
          Breakpoints.TabletPortrait
        );
        if (isTabletPotrait) {
        } else {
          // small laptop view
          const isSmallLaptop = this.breakpointObserver.isMatched(
            '(min-width: 840px) and (max-width: 1366px)'
          );
          if (isSmallLaptop) {
          } else {
            // Large laptop view
          }
        }
      }
    })
  );

  get currentBackground(): string {
    return `url(${this.images[this.currentImageIndex]})`;
  }
}
