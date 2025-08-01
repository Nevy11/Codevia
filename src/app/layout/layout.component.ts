import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeChangeService } from '../theme-change.service';
import { ProfileSettingsService } from './settings/profile-settings/profile-settings.service';
import { Profile } from './settings/profile-settings/profile';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'nevy11-layout',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    AsyncPipe,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  username: string = 'User'; // Placeholder for username
  profile!: Profile;
  themeChangeService = inject(ThemeChangeService);
  profileSettings = inject(ProfileSettingsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
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
  ngOnInit(): void {
    this.themeChangeService.loadTheme();
    this.profileSettings.profile$.subscribe((profile) => {
      this.profile = profile;
    });
  }
  goToTab(index: number) {
    this.router.navigate(['/layout/settings'], { queryParams: { tab: index } });
  }

  openSearch() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '800px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((videoId: string) => {
      if (videoId) {
        this.router.navigate(['/layout/learning'], {
          queryParams: {
            video: videoId,
          },
        });
      }
    });
  }
}
