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

  it('should render title after loading is complete', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // FIX 2: Manually set the loading flag to false so that your main content is rendered
    app.loading = false;

    // Trigger change detection to render the content that depends on `loading = false`
    fixture.detectChanges();

    // FIX 3: Update the text to match the component's title ('Codevia')
    // NOTE: If you don't have an <h1>, update the query selector (e.g., to 'div.title-text')
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, Codevia'
    );
  });
});
