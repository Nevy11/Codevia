import { Component, inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SupabaseClientService } from './supabase-client.service';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'nevy11-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Codevia';
  play = false;

  private platformId = inject(PLATFORM_ID);
  private supabase = inject(SupabaseClientService);

  constructor(private router: Router, private dialog: MatDialog) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.dialog.closeAll(); // Close dialogs on navigation
      }
    });
  }

  async ngOnInit() {
    // Only run browser-specific logic
    if (!isPlatformBrowser(this.platformId)) return;

    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        const { data, error } = await this.supabase.client.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!error) {
          console.log('Session restored:', data);
          window.history.replaceState({}, document.title, '/layout/home');
          this.router.navigate(['/layout/home']);
        }
      }
    } else {
      // Check existing session
      const { data } = await this.supabase.client.auth.getSession();
      if (data.session) {
        console.log('User already logged in');
        this.router.navigate(['/layout/home']);
      }
    }
  }
}
