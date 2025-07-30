import { Injectable } from '@angular/core';
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
    this.loadSettings()
  );
  settings$ = this.settingsSubject.asObservable();
  private loadSettings(): NotificationSettings {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : this.defaultSettings;
  }
  updateSettings(newSettings: NotificationSettings) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newSettings));
    this.settingsSubject.next(newSettings);
  }

  getSettings(): NotificationSettings {
    return this.settingsSubject.value;
  }
}
