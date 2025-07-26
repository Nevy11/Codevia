import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeChangeService {
  private currentTheme: 'light' | 'dark' = 'light';

  constructor() {}

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${this.currentTheme}-theme`);
    localStorage.setItem('theme', this.currentTheme);
  }

  loadTheme(): void {
    if (localStorage.getItem('theme')) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else {
        this.currentTheme = 'dark'; // Default theme
      }
      document.body.classList.add(`${this.currentTheme}-theme`);
    } else {
      document.body.classList.add('dark-theme');
      this.currentTheme = 'dark'; // Default to dark theme if no preference is saved
      localStorage.setItem('theme', this.currentTheme);
      document.body.classList.add('dark-theme');
    }
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }
}
