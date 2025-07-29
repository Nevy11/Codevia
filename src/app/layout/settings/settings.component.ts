import { Component } from '@angular/core';
import { PreferencesSettingsComponent } from './preferences-settings/preferences-settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
@Component({
  selector: 'nevy11-settings',
  imports: [
    PreferencesSettingsComponent,
    MatTabsModule,
    ProfileSettingsComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
