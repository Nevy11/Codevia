import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = false;

  setTheme(themeName: string) {
    document.body.classList.remove('violet-theme', 'magneta-theme');
    if (themeName) {
      document.body.classList.add(themeName);
    }
    localStorage.setItem('theme', themeName);
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', this.isDark.toString());
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || '';
    const darkMode = localStorage.getItem('darkMode') === 'true';

    if (savedTheme) {
      document.body.classList.add(savedTheme);
    }
    if (darkMode) {
      document.body.classList.add('dark-theme');
      this.isDark = true;
    }
  }
}
