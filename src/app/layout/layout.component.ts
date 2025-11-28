import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeChangeService } from '../theme-change.service';
import { Profile } from './settings/profile-settings/profile';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SupabaseClientService } from '../supabase-client.service';
import { ProfileService } from './settings/profile-setup-stepper/profile.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LearningService } from './learning/learning.service';

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
    MatSnackBarModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  username: string = ''; // Placeholder for username
  profile: Profile | null = null;
  themeChangeService = inject(ThemeChangeService);
  avatar_url: string = '';
  islogged_out: boolean = false;
  // isYoutubeShown!: boolean;

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  private supabaseService = inject(SupabaseClientService);
  private profileService = inject(ProfileService);
  private snackBar = inject(MatSnackBar);
  private learningService = inject(LearningService);
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
  async ngOnInit() {
    // this.isYoutubeShown = this.learningService.get_show_yt();
    this.themeChangeService.loadTheme();
    this.profile = await this.supabaseService.getProfile();
    if (!this.supabaseService.client) {
      // console.error('Supabase client is not initialized.');
      return;
    }
    if (this.profile) {
      this.profileService.updateAvatarUrl(this.profile.avatarUrl);
      this.profileService.updateName(this.profile.name);
      this.profileService.updateBio(this.profile.bio);
      this.profileService.name$.subscribe((name) => {
        this.username = name;
      });
    } else {
      console.error('Error while updating the signals');
    }
    this.profileService.avatarUrl$.subscribe((url_avatar) => {
      this.avatar_url = url_avatar;
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

  async logout() {
    this.islogged_out = await this.supabaseService.logout();
    if (this.islogged_out) {
      this.snackBar.open('Logged out successfully', `Close`, {
        duration: 3600,
      });
      this.themeChangeService.setTheme('light');
      this.router.navigate(['']);
    } else {
      this.snackBar.open(`log out unsuccessfull`, `Close`, {
        duration: 3600,
      });
    }
  }
  showYoutube() {
    console.log(`${this.learningService.getShowYT()}`);
    if (this.learningService.getShowYT()) {
      this.learningService.set_show_yt(false);
      this.snackBar.open(`Youtube hidden`, `Close`, {
        duration: 3000,
      });
    } else {
      this.learningService.set_show_yt(true);
      this.snackBar.open(`Youtube displayed`, `Close`, {
        duration: 3000,
      });
    }
  }
}
