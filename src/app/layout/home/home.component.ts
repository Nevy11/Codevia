import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Breakpoints } from '@angular/cdk/layout';
import { from, map, of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SupabaseClientService } from '../../supabase-client.service';
import { Profile } from '../settings/profile-settings/profile';
import { Stats } from './home';
import { LoaderComponent } from '../learning/loader/loader.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'nevy11-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    LoaderComponent,
    BaseChartDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  username = '';
  loadingUrls: boolean = true;
  profile: Profile | null = null;
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private supabaseService = inject(SupabaseClientService);
  user_id: string | null = null;
  stats: Stats | null = null;
  userId$ = from(this.supabaseService.getCurrentUserId());

  stats$ = this.userId$.pipe(
    switchMap((userId) => {
      if (!userId) return of(null);
      return from(this.supabaseService.getCourseStats(userId));
    }),
  );
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            mobile_device: true,
          },
        ];
      } else {
        // tablet potrait view
        const isTabletPotrait = this.breakpointObserver.isMatched(
          Breakpoints.TabletPortrait,
        );
        if (isTabletPotrait) {
          return [
            {
              mobile_device: false,
            },
          ];
        } else {
          // small laptop view
          const isSmallLaptop = this.breakpointObserver.isMatched(
            '(min-width: 840px) and (max-width: 1366px)',
          );
          if (isSmallLaptop) {
            return [
              {
                mobile_device: false,
              },
            ];
          } else {
            return [
              {
                mobile_device: false,
              },
            ];
            // Large laptop view
          }
        }
      }
    }),
  );
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
    plugins: {
      legend: { display: false },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Check-ins', backgroundColor: '#3f51b5' }],
  };
  ToLearning() {
    this.router.navigate(['/layout/learning']);
  }

  async ngOnInit(): Promise<void> {
    this.supabaseService.logActivity();
    this.loadStats();
    this.profile = await this.supabaseService.getProfile();
    if (this.profile) {
      this.username = this.profile.name;
    }

    this.user_id = await this.supabaseService.getCurrentUserId();
    if (this.user_id) {
      // create observable AFTER we know the user_id
      this.stats$ = from(this.supabaseService.getCourseStats(this.user_id));

      // if you still want the console log:
      this.stats$.subscribe((stat) => {
        this.stats = stat;
      });
    }
    this.loadingUrls = false;
  }
  async loadStats() {
    const chartData = await this.supabaseService.getWeeklyStats();

    // Correct way to log objects to the console
    console.log('Chart data received:', chartData);

    // 2. Map the data to the chart
    if (chartData) {
      this.barChartData = {
        labels: chartData.map((item) => item.day),
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: chartData.map((item) => item.count),
          },
        ],
      };
    }
  }
}
