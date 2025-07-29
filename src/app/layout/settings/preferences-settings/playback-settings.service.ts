import { Injectable } from '@angular/core';
import { parse } from 'path';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaybackSettingsService {
  private speedSubject = new BehaviorSubject<number>(
    parseFloat(localStorage.getItem('playbackSpeed') || '1.0')
  );
  speed$ = this.speedSubject.asObservable();

  setSpeed(speed: number): void {
    this.speedSubject.next(speed);
    localStorage.setItem('playbackSpeed', speed.toString());
  }
  getSpeed(): number {
    return this.speedSubject.getValue();
  }
}
