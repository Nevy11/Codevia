import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  ],
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Learn', cols: 1, rows: 1 },
          { title: 'Course', cols: 1, rows: 1 },
          { title: 'Stats', cols: 1, rows: 1 },
          { title: 'Setting', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Learn', cols: 2, rows: 1 },
        { title: 'Courses', cols: 1, rows: 1 },
        { title: 'Statistics', cols: 1, rows: 2 },
        { title: 'Settings', cols: 1, rows: 1 },
      ];
    })
  );
}
