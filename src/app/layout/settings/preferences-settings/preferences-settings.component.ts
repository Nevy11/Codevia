import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ThemeChangeService } from '../../../theme-change.service';
import { Subscription } from 'rxjs';
import { PlaybackSettingsService } from './playback-settings.service';
@Component({
  selector: 'nevy11-preferences-settings',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './preferences-settings.component.html',
  styleUrl: './preferences-settings.component.scss',
})
export class PreferencesSettingsComponent implements OnInit, OnDestroy {
  darkMode = false;
  private sub!: Subscription;
  playbackSpeed = localStorage.getItem('playbackSpeed') || '1.0';
  fontSize = localStorage.getItem('fontSize') || 16;

  speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  themeChangeService = inject(ThemeChangeService);
  private playbackService = inject(PlaybackSettingsService);
  savePlaybackSpeed() {
    this.playbackService.setSpeed(parseFloat(this.playbackSpeed));
  }

  saveFontSize() {
    localStorage.setItem('fontSize', this.fontSize.toString());
    document.documentElement.style.setProperty(
      '--app-font-size',
      `${this.fontSize}px`
    );
  }

  ngOnInit(): void {
    this.sub = this.themeChangeService.theme$.subscribe((theme) => {
      this.darkMode = theme === 'dark';
      document.body.classList.remove('dark-theme', 'light-theme');
      document.body.classList.add(`${theme}-theme`);
    });
    this.themeChangeService.loadTheme();
    this.darkMode = this.themeChangeService.getCurrentTheme() === 'dark';
    this.playbackSpeed = localStorage.getItem('playbackSpeed') || '1.0';
    this.fontSize = parseInt(localStorage.getItem('fontSize') || '16', 10);
    document.documentElement.style.setProperty(
      '--app-font-size',
      `${this.fontSize}px`
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
