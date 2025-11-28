import { inject, Injectable, signal } from '@angular/core';
import { SupabaseClientService } from '../../supabase-client.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LearningService {
  private show_yt = signal(true); // or BehaviorSubject
  getShowYT() {
    return this.show_yt();
  }

  private supabase = inject(SupabaseClientService);
  private showYtSubject = new BehaviorSubject<boolean>(true);

  showYt$ = this.showYtSubject.asObservable();

  toggle_show_yt() {
    this.showYtSubject.next(!this.showYtSubject.value);
  }
  async loadShowYT() {
    this.show_yt.set(await this.supabase.getShowYT());
  }

  get_show_yt() {
    return this.show_yt();
  }

  async set_show_yt(x: boolean) {
    this.show_yt.set(x);
    await this.supabase.setShowYT(x);
    console.log('supabase updated successfully');
  }
}
