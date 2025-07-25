import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ThemeService } from '../theme.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'nevy11-layout',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    NgOptimizedImage,
    MatMenuModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  username: string = 'User'; // Placeholder for username
  themeService = inject(ThemeService);
  ngOnInit(): void {
    // this.themeService.loadTheme();
    this.themeService.setTheme('violet-theme');
  }
}
