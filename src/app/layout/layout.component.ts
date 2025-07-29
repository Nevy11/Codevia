import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeChangeService } from '../theme-change.service';
import { ProfileSettingsService } from './settings/profile-settings/profile-settings.service';
import { Profile } from './settings/profile-settings/profile';
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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  username: string = 'User'; // Placeholder for username
  profile!: Profile;
  themeChangeService = inject(ThemeChangeService);
  profileSettings = inject(ProfileSettingsService);
  ngOnInit(): void {
    this.themeChangeService.loadTheme();
    this.profileSettings.profile$.subscribe((profile) => {
      this.profile = profile;
    });
  }
}
