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

  ngOnInit(): void {
    this.settingService.settings$.subscribe((data) => {
      this.settings = { ...data };
      
      // Cross-check with actual browser permission
      if (Notification.permission !== 'granted') {
        this.settings.pushNotifications = false;
      }
    });
  }
  
  async onTogglePush(enabled: boolean) {
    const userId = await this.supabaseService.getCurrentUserId();
    
    if (enabled) {
      try {
        const sub = await this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
        });
        await this.supabaseService.savePushSubscription(sub);
        
        // Optional: Send a "You're subscribed" alert
        if (userId) {
          await this.supabaseService.sendLoginNotification(userId);
        }
      } catch (err) {
        this.settings.pushNotifications = false; // Reset toggle on error
      }
    } else {
      try {
        await this.swPush.unsubscribe(); // Stop browser from listening
        if (userId) {
          await this.supabaseService.deletePushSubscription(userId); 
        }
      } catch (err) {
        console.error('Unsubscribe failed', err);
      }
    }
    this.save(); 
  }

  save() {
    this.settingService.updateSettings(this.settings);
  }
}
