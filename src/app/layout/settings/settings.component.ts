import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PreferencesSettingsComponent } from './preferences-settings/preferences-settings.component';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'nevy11-settings',
  imports: [
    PreferencesSettingsComponent,
    MatTabsModule,
    ProfileSettingsComponent,
    NotificationSettingsComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  selectedIndex = 0;
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   const tab = params['tab'] ? Number(params['tab']) : 0;
    //   if (this.tabGroup) {
    //     this.tabGroup.selectedIndex = tab;
    //   }
    // });
    this.route.queryParams.subscribe((params) => {
      this.selectedIndex = params['tab'] ? Number(params['tab']) : 0;
    });
  }
}
