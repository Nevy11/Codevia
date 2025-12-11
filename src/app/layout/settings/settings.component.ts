import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PreferencesSettingsComponent } from './preferences-settings/preferences-settings.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ActivatedRoute } from '@angular/router';
import { SupabaseClientService } from '../../supabase-client.service';
import { ProfileSetupStepperComponent } from './profile-setup-stepper/profile-setup-stepper.component';
@Component({
  selector: 'nevy11-settings',
  imports: [
    PreferencesSettingsComponent,
    MatTabsModule,
    ProfileSettingsComponent,
    NotificationSettingsComponent,
    ProfileSetupStepperComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  selectedIndex = 0;
  private route = inject(ActivatedRoute);
  private supabaseService = inject(SupabaseClientService);
  isFirstTime!: boolean;
  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedIndex = params['tab'] ? Number(params['tab']) : 0;
    });
    // Detects whether it's the user's first time setting up their profile
    this.isFirstTime = await this.supabaseService.isFirstTimeProfileUpdate();
  }
}
