import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private onlineSubject = new BehaviorSubject<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  online$ = this.onlineSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const online$ = fromEvent(window, 'online').pipe(mapTo(true));
      const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

      merge(online$, offline$, of(navigator.onLine)).subscribe((status) => {
        this.onlineSubject.next(status);
      });
    }
  }

  isOnline(): boolean {
    return this.onlineSubject.value;
  }
}
