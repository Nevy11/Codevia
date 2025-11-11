import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LearningService {
  private show_yt = false;

  get_show_yt() {
    return this.show_yt;
  }
  set_show_yt(x: boolean) {
    this.show_yt = x;
  }
}
