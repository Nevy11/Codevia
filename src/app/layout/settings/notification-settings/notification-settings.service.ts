import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationSettings } from './notification-settings';
import { SupabaseClientService } from '../../../supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationSettingsService {
  private supabaseClient = inject(SupabaseClientService);

  private defaultSettings: NotificationSettings = {
    learningReminders: true,
    productUpdates: true,
    emailNotifications: false,
    pushNotifications: false,
    inAppNotifications: true,
    frequency: 'daily',
  };

  // The state that the component listens to
  private settingsSubject = new BehaviorSubject<NotificationSettings>(this.defaultSettings);
  settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadInitialSettings();
  }


  //  Fetches settings from Supabase. 
  //  If not found, it keeps the defaults.
 
  private async loadInitialSettings() {
    try {
      const dbSettings = await this.supabaseClient.getNotificationSettings();
      if (dbSettings) {
        this.settingsSubject.next(dbSettings);
      }
    } catch (error) {
      console.error('Failed to load settings from Supabase:', error);
    }
  }

  
  // Updates the state and pushes to Supabase
   
  async updateSettings(newSettings: NotificationSettings) {
    // 1. Optimistic Update: Update UI immediately
    this.settingsSubject.next({ ...newSettings });

    // 2. Persist to Database
    const success = await this.supabaseClient.updateNotificationSettings(newSettings);
    
    if (!success) {
      // Optional: Roll back or notify user on failure
      console.error('Database sync failed.');
    }
  }

  
  //  Synchronous getter for current state
   
  getSettings(): NotificationSettings {
    return this.settingsSubject.value;
  }
}