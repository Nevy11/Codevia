// import { BehaviorSubject } from 'rxjs';
// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({ providedIn: 'root' })
// export class ThemeChangeService {
//   private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
//   theme$ = this.themeSubject.asObservable();

//   constructor(@Inject(PLATFORM_ID) private platformId: object) {}

//   toggleTheme(): void {
//     const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
//     this.setTheme(newTheme);
//   }

//   setTheme(theme: 'light' | 'dark') {
//     this.themeSubject.next(theme);

//     // Update body classes
//     document.body.classList.remove('light-theme', 'dark-theme');
//     document.body.classList.add(`${theme}-theme`);

//     // Save preference
//     localStorage.setItem('theme', theme);
//   }

//   loadTheme(): void {
//     const savedTheme =
//       (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
//     this.setTheme(savedTheme);
//   }

//   getCurrentTheme(): 'light' | 'dark' {
//     return this.themeSubject.value;
//   }
// }
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeChangeService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.themeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeSubject.next(theme);

    if (isPlatformBrowser(this.platformId)) {
      // Update body classes
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);

      // Save preference
      localStorage.setItem('theme', theme);
    }
  }

  loadTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme =
        (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
      this.setTheme(savedTheme);
    }
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }
}
