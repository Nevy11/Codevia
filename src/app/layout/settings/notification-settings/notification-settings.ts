// src/app/core/models/notification-settings.model.ts
export interface NotificationSettings {
  learningReminders: boolean; // Notify about enrolled courses progress
  productUpdates: boolean; // Notify about new features and platform updates
  emailNotifications: boolean; // Receive notifications via email
  pushNotifications: boolean; // For PWA push
  inAppNotifications: boolean; // Shown inside the app
  frequency: 'instant' | 'daily' | 'weekly' | 'never';
}
