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
      data: {
        url: 'https://www.youtube.com/embed/rfscVS0vtbw?autoplay=1&mute=1',
        language: 'Python',
        code: `# Welcome to Python on Codevia!
# Sign up to start learning and run real code.

def greet():
    print("Hello, Future Python Developer!")

greet()`,
      },
    });
  }
  openJavaScriptHtml(): void {
    console.log('Opening video dialog');
    this.dialog.open(VideoDialogComponent, {
      width: '80%',
      height: '80%',
      panelClass: 'video-dialog',
      data: {
        url: 'https://www.youtube.com/embed/PkZNo7MFNFg?autoplay=1&mute=1',
        language: 'HTML',
        code: `// Welcome to JavaScript on Codevia!
// Sign up to start learning and run real JavaScript code.

function greet() {
    console.log("Hello, Future JavaScript Developer!");
}

greet();`,
      },
    });
  }

  openRustVideo(): void {
    console.log('Opening video dialog');
    this.dialog.open(VideoDialogComponent, {
      width: '80%',
      height: '80%',
      panelClass: 'video-dialog',
      data: {
        url: 'https://www.youtube.com/embed/rQ_J9WH6CGk?autoplay=1&mute=1',
        language: 'Rust',
        code: `// Welcome to Rust on Codevia!
// Sign up to start learning and run real Rust code.

fn greet() {
    println!("Hello, Future Rust Developer!");
}

fn main() {
    greet();
}`,
      },
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
