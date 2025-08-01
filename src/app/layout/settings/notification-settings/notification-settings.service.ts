import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NotificationSettings } from './notification-settings';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationSettingsService {
  private readonly STORAGE_KEY = 'notificationSettings';

  private defaultSettings: NotificationSettings = {
    learningReminders: true,
    productUpdates: true,
    emailNotifications: false,
    pushNotifications: false,
    inAppNotifications: true,
    frequency: 'daily',
  };

  private settingsSubject = new BehaviorSubject<NotificationSettings>(
    this.defaultSettings
  );
  settings$ = this.settingsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.settingsSubject.next(JSON.parse(data));
      }
    }
  }

  updateSettings(newSettings: NotificationSettings) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSettings));
    }
    this.settingsSubject.next(newSettings);
  }

  getSettings(): NotificationSettings {
    return this.settingsSubject.value;
  }
}
