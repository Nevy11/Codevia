import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlaybackSettingsService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(platformId)) {
      const savedSpeed = parseFloat(
        localStorage.getItem('playbackSpeed') || '1.0'
      );
      this.speedSubject.next(savedSpeed);
    }
  }
  private speedSubject = new BehaviorSubject<number>(1.0);
  speed$ = this.speedSubject.asObservable();

  setSpeed(speed: number): void {
    this.speedSubject.next(speed);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('playbackSpeed', speed.toString());
    }
  }
  getSpeed(): number {
    return this.speedSubject.getValue();
  }
}
