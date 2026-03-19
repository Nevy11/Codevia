import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { SupabaseClientService } from '../../supabase-client.service';

@Component({
  selector: 'nevy11-notification-center',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.scss',
})
export class NotificationCenterComponent implements OnInit {
  private supabase = inject(SupabaseClientService);

  notifications = signal<any[]>([]);
  unreadCount = signal(0);

  async ngOnInit() {
    await this.loadNotifications();
    this.setupRealtime();
  }

  async loadNotifications() {
    const data = await this.supabase.getNotifications();
    this.notifications.set(data);
    this.unreadCount.set(data.filter((n) => !n.is_read).length);
  }

  setupRealtime() {
    this.supabase.client
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          this.notifications.update((prev) => [payload.new, ...prev]);
          this.unreadCount.update((count) => count + 1);
        },
      )
      .subscribe();
  }

  async markAsRead() {
    const success = await this.supabase.clearAllNotifications();

    if (success) {
      this.notifications.set([]);
      this.unreadCount.set(0);
    }
  }

  async markAllRead() {
    const userId = await this.supabase.getCurrentUserId();
    await this.supabase.client
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    this.unreadCount.set(0);
    this.notifications.update((list) =>
      list.map((n) => ({ ...n, is_read: true })),
    );
  }
}
