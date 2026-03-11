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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LearningService } from './learning/learning.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { NotificiationService } from '../notification.service';
import { NotificationCenterComponent } from './notification-center/notification-center.component';
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
    NotificationCenterComponent,
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

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  private supabaseService = inject(SupabaseClientService);
  private profileService = inject(ProfileService);
  private learningService = inject(LearningService);
  private notify = inject(NotificiationService);
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
          Breakpoints.TabletPortrait,
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
            '(min-width: 840px) and (max-width: 1366px)',
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
    }),
  );
  async ngOnInit() {
    // this.triggerManualReminder();
    this.themeChangeService.loadTheme();
    this.profile = await this.supabaseService.getProfile();
    if (!this.supabaseService.client) {
      
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
    await this.checkLearningReminders();
  }
  private async checkLearningReminders() {
    const stats = await this.supabaseService.getWeeklyStats();
    const todayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    
    // Find today's activity count
    const todayActivity = stats.find(s => s.day === todayName);

    // If count is 0, they haven't logged activity yet today
    if (todayActivity && todayActivity.count === 0) {
      this.notify.show('Welcome back! Ready to continue your learning journey? 📚');
    }
  }
  goToTab(index: number) {
    this.router.navigate(['/layout/settings'], { queryParams: { tab: index } });
  }

  
  // In layout.component.ts
  async openSearch() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '800px',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe(async (videoData: any) => {
      if (videoData) {
        // 1. Create the Course entry in Supabase
        const isCourseCreated = await this.supabaseService.createCourse(
          videoData.id,
          videoData.thumbnailUrl,
          videoData.title,
          'Imported via Search',
        );

        if (isCourseCreated) {
          const userId = await this.supabaseService.getCurrentUserId();

          if (userId) {
            // 2. Enroll the user automatically
            await this.supabaseService.enrollCourse(userId, videoData.id);

            // 3. Initialize progress to avoid the Foreign Key error (fk_video_course)
            await this.supabaseService.saveCurrentVideo(videoData.id);
          }

          // 4. Finally, navigate to the learning section
          this.router.navigate(['/layout/learning'], {
            queryParams: { video: videoData.id },
          });
        } else {
          
          this.notify.show('Error registering course');
        }
      }
    });
  }

  

  async logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        // 1. Get current userId before logging out
        const userId = await this.supabaseService.getCurrentUserId();

        this.islogged_out = await this.supabaseService.logout();
        
        if (this.islogged_out) {
          // 2. Trigger the notification if we have a userId
          if (userId) {
            this.supabaseService.sendLogoutNotification(userId);
          }

          this.notify.show('Logged out successfully');
          this.themeChangeService.setTheme('light');
          this.router.navigate(['']);
        } else {
          this.notify.show('Logout unsuccessful');
        }
      }
    });
  }
  showYoutube() {
    console.log(`${this.learningService.getShowYT()}`);
    if (this.learningService.getShowYT()) {
      this.learningService.set_show_yt(false);
      this.notify.show('Youtube hidden');
      
    } else {
      this.learningService.set_show_yt(true);
      this.notify.show('Youtube displayed');
      
    }
  }
  async triggerManualReminder() {
    const userId = await this.supabaseService.getCurrentUserId();
    if (userId) {
      // This hits your Edge Function which sends the Web Push
      await this.supabaseService.sendLoginNotification(userId); 
      // this.notify.show('Push reminder sent to your device!');
    }
  }
}
