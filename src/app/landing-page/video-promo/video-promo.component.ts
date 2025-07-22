import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { NgOptimizedImage } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'nevy11-video-promo',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    NgOptimizedImage,
    AsyncPipe,
  ],
  templateUrl: './video-promo.component.html',
  styleUrl: './video-promo.component.scss',
})
export class VideoPromoComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);
  openVideo(): void {
    console.log('Opening video dialog');
    this.dialog.open(VideoDialogComponent, {
      width: '80%',
      height: '80%',
      panelClass: 'video-dialog',
    });
  }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            mobile_device: true,
            isTabletPotrait: false,
            isSmallLaptop: false,
            isLargeLaptop: false,
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
              isTabletPotrait: true,
              isSmallLaptop: false,
              isLargeLaptop: false,
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
                isTabletPotrait: false,
                isSmallLaptop: true,
                isLargeLaptop: false,
              },
            ];
          } else {
            return [
              {
                mobile_device: false,
                isTabletPotrait: false,
                isSmallLaptop: false,
                isLargeLaptop: true,
              },
            ];
            // Large laptop view
          }
        }
      }
    })
  );
}
