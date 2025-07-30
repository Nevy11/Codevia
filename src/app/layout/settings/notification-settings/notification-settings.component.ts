import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationSettings } from './notification-settings';
import { NotificationSettingsService } from './notification-settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nevy11-notification-settings',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
  ],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
})
export class NotificationSettingsComponent implements OnInit {
  settings!: NotificationSettings;
  frequencies = ['instant', 'daily', 'weekly', 'never'];

  private settingService = inject(NotificationSettingsService);
  ngOnInit(): void {
    this.settings = this.settingService.getSettings();
  }
  save() {
    this.settingService.updateSettings(this.settings);
  }
}
