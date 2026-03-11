import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationSettingsService } from './layout/settings/notification-settings/notification-settings.service';
import { SupabaseClientService } from './supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class NotificiationService {
  private snackBar = inject(MatSnackBar);
  private settingsService = inject(NotificationSettingsService);
  private supabase = inject(SupabaseClientService);

  async show(message: string, action: string = 'Close', config?: MatSnackBarConfig, persist: boolean = false) {
    const settings = this.settingsService.getSettings();

    // 1. Show the SnackBar
    if (settings.inAppNotifications) {
      this.snackBar.open(message, action, { duration: 3000, ...config });
    }

    // 2. Persist to Database if requested
    if (persist) {
      const userId = await this.supabase.getCurrentUserId();
      if (userId) {
        await this.supabase.client.from('notifications').insert({
          user_id: userId,
          title: 'System Alert',
          message: message,
          type: 'system'
        });
      }
    }
  }
}
