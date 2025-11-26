import { inject, Injectable } from '@angular/core';
import { SupabaseClientService } from '../../supabase-client.service';

@Injectable({
  providedIn: 'root',
})
export class LearningService {
  private show_yt = false;

  private supabase = inject(SupabaseClientService);
  async loadShowYT() {
    this.show_yt = await this.supabase.getShowYT();
  }

  get_show_yt() {
    return this.show_yt;
  }

  async set_show_yt(x: boolean) {
    this.show_yt = x;
    await this.supabase.setShowYT(x);
  }
}
