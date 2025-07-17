import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'nevy11-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgOptimizedImage,
  ],
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            title: 'Learn',
            cols: 2,
            rows: 1,
            card_content: 'Learn about various topics',
            image: '/dashboardImages/learn.jpeg',
            imageWidth: 250,
            imageHeight: 164,
          },
          {
            title: 'Courses',
            cols: 2,
            rows: 1,
            card_content: 'View available courses',
            image: '/dashboardImages/courses.png',
            imageWidth: 250,
            imageHeight: 164,
          },
          {
            title: 'Stats',
            cols: 2,
            rows: 1,
            card_content: 'Get Detailed statistics about your progress',
            image: 'dashboardImages/stat.jpeg',
            imageWidth: 250,
            imageHeight: 164,
          },
          {
            title: 'Setting',
            cols: 2,
            rows: 1,
            card_content: 'Change your username and password',
            image: 'dashboardImages/settings_project.png',
            imageWidth: 250,
            imageHeight: 164,
          },
        ];
      }

      return [
        {
          title: 'Learn',
          cols: 2,
          rows: 2,
          card_content: 'Continue learning about various topics',
          image: 'dashboardImages/learn.jpeg',
          imageWidth: 600,
          imageHeight: 480,
        },
        {
          title: 'Courses',
          cols: 1,
          rows: 1,
          card_content: 'View available courses',
          image: 'dashboardImages/courses.png',
          imageWidth: 250,
          imageHeight: 164,
        },
        {
          title: 'Statistics',
          cols: 1,
          rows: 2,
          card_content: 'Get Detailed statistics about your progress',
          image: 'dashboardImages/stat.jpeg',
          imageWidth: 250,
          imageHeight: 164,
        },
        {
          title: 'Settings',
          cols: 1,
          rows: 1,
          card_content: 'Change your username and password',
          image: 'dashboardImages/settings_project.png',
          imageWidth: 250,
          imageHeight: 164,
        },
      ];
    })
  );
}
