import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationSettings } from './notification-settings';
import { NotificationSettingsService } from './notification-settings.service';
import { CommonModule } from '@angular/common';
import { SupabaseClientService } from '../../../supabase-client.service';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../../environments/environment';

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
  private supabaseService = inject(SupabaseClientService);
  private swPush = inject(SwPush);

  // readonly VAPID_PUBLIC_KEY = "BH362Ae9m5yRBU2JeVv43IJIs0jxEKacm0g2rjjY_WofSVmOJ2NjYr4giGO7NKEoAaZpdW_eQU8aLiL9I5KDOII"; 
  private readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;

  async ngOnInit(): Promise<void> {
    this.settingService.settings$.subscribe((data) => {
      this.settings = { ...data };
    });
  }
  
  async onTogglePush(enabled: boolean) {
    if (enabled) {
      try {
        const sub = await this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
        });
        
        const saved = await this.supabaseService.savePushSubscription(sub);
        
        if (saved) {
          // Trigger the Welcome Notification
          await this.supabaseService.generateAiResponse(JSON.stringify({
            user_id: await this.supabaseService.getCurrentUserId(),
            title: "Account Active! 🎉",
            message: "Welcome to Codevia. Your push notifications are now successfully configured."
          }));
        }
        
        this.save();
      } catch (err: any) {
        console.error('Push subscription failed:', err);
        if (err.message.includes('push service error')) {
          alert("Check Brave settings for 'Google services for push messaging'.");
        }
        this.settings.pushNotifications = false;
      }
    }
  }

  save() {
    this.settingService.updateSettings(this.settings);
  }
}
