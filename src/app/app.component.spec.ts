// app.component.spec.ts

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseClientService } from './supabase-client.service';
import { NetworkService } from './network.service';
import { of } from 'rxjs';

// --- Define Mock Objects ---
const mockRouter = {
  events: of(new NavigationEnd(1, '/', '/')),
  navigate: jasmine.createSpy('navigate'),
};
const mockDialog = { closeAll: jasmine.createSpy('closeAll') };
const mockSnackbar = { open: jasmine.createSpy('open') };
const mockSupabase = {
  client: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      setSession: () => Promise.resolve({ data: {}, error: null }),
    },
  },
};
const mockNetwork = { online$: of(true) };

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // Providing all necessary mocks to prevent "No Provider Found" errors
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackbar },
        { provide: SupabaseClientService, useValue: mockSupabase },
        { provide: NetworkService, useValue: mockNetwork },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'Codevia' title`, () => {
    // FIX 1: Ensure test matches component value
    expect(app.title).toEqual('Codevia');
  });

  it('should render the router-outlet when loading is false', () => {
    // Component starts with app.loading = true

    // Set loading to false
    app.loading = false;
    fixture.detectChanges();

    // Check if the <router-outlet> is present and the loading screen is gone
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('.loading-screen')).toBeFalsy();
  });

  it('should render the loading screen when loading is true', () => {
    // Component starts with app.loading = true
    fixture.detectChanges();

    // Check if the loading screen div is present
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-screen')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeFalsy();
  });
});
