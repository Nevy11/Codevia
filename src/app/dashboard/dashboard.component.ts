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
        console.log('Handset View');
        return [
          {
            title: 'Learn',
            cols: 2,
            rows: 1,
            card_content: 'Learn about various topics',
            image: '/dashboardImages/learn.jpeg',
            imageWidth: 250,
            imageHeight: 164,
            device: 'phone',
          },
          {
            title: 'Courses',
            cols: 2,
            rows: 1,
            card_content: 'View available courses',
            image: '/dashboardImages/courses.png',
            imageWidth: 250,
            imageHeight: 164,
            device: 'phone',
          },
          {
            title: 'Stats',
            cols: 2,
            rows: 1,
            card_content: 'Get Detailed statistics about your progress',
            image: 'dashboardImages/stat.jpeg',
            imageWidth: 250,
            imageHeight: 164,
            device: 'phone',
          },
          {
            title: 'Setting',
            cols: 2,
            rows: 1,
            card_content: 'Change your username and password',
            image: 'dashboardImages/new_set.png',
            imageWidth: 230,
            imageHeight: 164,
            device: 'phone',
          },
        ];
      } else {
        // tablet potrati view
        const isTabletPotrait = this.breakpointObserver.isMatched(
          Breakpoints.TabletPortrait
        );
        if (isTabletPotrait) {
          console.log('Tablet Portrait View');
          return [
            {
              title: 'Learn',
              cols: 2,
              rows: 1,
              card_content: 'Learn about various topics',
              image: '/dashboardImages/learn.jpeg',
              imageWidth: 243,
              imageHeight: 160,
              device: 'tablet',
            },
            {
              title: 'Courses',
              cols: 2,
              rows: 1,
              card_content: 'View available courses',
              image: '/dashboardImages/courses.png',
              imageWidth: 235,
              imageHeight: 170,
              device: 'tablet',
            },
            {
              title: 'Stats',
              cols: 2,
              rows: 1,
              card_content: 'Get Detailed statistics about your progress',
              image: 'dashboardImages/stat.jpeg',
              imageWidth: 246,
              imageHeight: 164,
              device: 'tablet',
            },
            {
              title: 'Setting',
              cols: 2,
              rows: 1,
              card_content: 'Change your username and password',
              image: 'dashboardImages/new_set.png',
              imageWidth: 180,
              imageHeight: 180,
              device: 'tablet',
            },
          ];
        } else {
          const isSmallLaptop = this.breakpointObserver.isMatched(
            '(min-width: 840px) and (max-width: 1366px)'
          );
          if (isSmallLaptop) {
            console.log('Small Laptop View');
            return [
              {
                title: 'Learn',
                cols: 2,
                rows: 2,
                card_content: 'Learn about various topics',
                image: 'dashboardImages/learn.jpeg',
                imageWidth: 760,
                imageHeight: 500,
                device: 'small_laptop',
              },
              {
                title: 'Courses',
                cols: 1,
                rows: 1,
                card_content: 'View available courses',
                image: 'dashboardImages/courses.png',
                imageWidth: 248,
                imageHeight: 180,
                device: 'small_laptop',
              },
              {
                title: 'Statistics',
                cols: 1,
                rows: 2,
                card_content: 'Get Detailed statistics about your progress',
                image: 'dashboardImages/stat.jpeg',
                imageWidth: 375,
                imageHeight: 250,
                device: 'small_laptop',
              },
              {
                title: 'Settings',
                cols: 1,
                rows: 1,
                card_content: 'Change your username and password',
                image: 'dashboardImages/new_set.png',
                imageWidth: 180,
                imageHeight: 180,
                device: 'small_laptop',
              },
            ];
          }
          // laptop view
          else {
            console.log('Large View');
            return [
              {
                title: 'Learn',
                cols: 2,
                rows: 2,
                card_content: 'Learn about various topics',
                image: 'dashboardImages/learn.jpeg',
                imageWidth: 760,
                imageHeight: 500,
                device: 'large_view',
              },
              {
                title: 'Courses',
                cols: 1,
                rows: 1,
                card_content: 'View available courses',
                image: 'dashboardImages/courses.png',
                imageWidth: 250,
                imageHeight: 180,
                device: 'large_view',
              },
              {
                title: 'Statistics',
                cols: 1,
                rows: 2,
                card_content: 'Get Detailed statistics about your progress',
                image: 'dashboardImages/stat.jpeg',
                imageWidth: 375,
                imageHeight: 250,
                device: 'large_view',
              },
              {
                title: 'Settings',
                cols: 1,
                rows: 1,
                card_content: 'Change your username and password',
                image: 'dashboardImages/updated_set.png',
                imageWidth: 219,
                imageHeight: 164,
                device: 'large_view',
              },
            ];
          }
        }
      }
    })
  );
}
