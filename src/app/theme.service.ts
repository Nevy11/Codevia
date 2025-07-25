import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = false;

  setTheme(themeName: string) {
    document.body.classList.remove('dark-theme', 'light-theme');
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

  toggleDarkTheme() {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      this.isDark = false;
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      this.isDark = true;
    }
    localStorage.setItem('darkMode', this.isDark.toString());
  }
  gettheme() {
    const savedTheme = localStorage.getItem('darkMode') || '';
    if (savedTheme) {
      return savedTheme;
    } else {
      return 'dark'; // Default theme
    }
    document.body.classList.add(savedTheme);
  }
}
