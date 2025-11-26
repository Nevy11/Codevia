import { inject, Injectable, signal } from '@angular/core';
import { SupabaseClientService } from '../../supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class LearningService {
  private show_yt = signal(true); // or BehaviorSubject
  getShowYT() {
    return this.show_yt();
  }

  private supabase = inject(SupabaseClientService);
  async loadShowYT() {
    this.show_yt.set(await this.supabase.getShowYT());
  }

  get_show_yt() {
    return this.show_yt;
  }

  async set_show_yt(x: boolean) {
    this.show_yt.set(x);
    await this.supabase.setShowYT(x);
  }
}
