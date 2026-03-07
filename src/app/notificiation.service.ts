import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationSettingsService } from './layout/settings/notification-settings/notification-settings.service';

@Injectable({
  providedIn: 'root',
})
export class NotificiationService {
  private snackBar = inject(MatSnackBar);
  private settingsService = inject(NotificationSettingsService);

  /**
   * Wrapper for MatSnackBar.open
   * Only displays if 'In-App Notifications' is toggled ON.
   */
  show(message: string, action: string = 'Close', config?: MatSnackBarConfig) {
    const settings = this.settingsService.getSettings();

    if (settings.inAppNotifications) {
      this.snackBar.open(message, action, {
        duration: 3000,
        ...config
      });
    } else {
      console.log('Notification blocked: User has disabled in-app alerts.');
    }
  }
}
