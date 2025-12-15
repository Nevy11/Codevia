import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ThemeChangeService } from '../theme-change.service';
import { SupabaseClientService } from '../supabase-client.service';
import { ProfileService } from './settings/profile-setup-stepper/profile.service';
import { LearningService } from './learning/learning.service';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
};

const mockActivatedRoute = {
  snapshot: {},
  queryParams: of({}),
};

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(null),
  }),
};

const mockBreakpointObserver = {
  observe: () => of({ matches: false }),
  isMatched: () => false,
};

const mockSupabaseService = {
  getProfile: () => Promise.resolve(null),
  logout: () => Promise.resolve(false),
};

const mockProfileService = {
  updateAvatarUrl: jasmine.createSpy('updateAvatarUrl'),
  updateName: jasmine.createSpy('updateName'),
  updateBio: jasmine.createSpy('updateBio'),
  name$: of('Test User'),
  avatarUrl$: of('test-url'),
};

const mockSnackBar = {
  open: jasmine.createSpy('open'),
};

const mockLearningService = {
  getShowYT: () => true,
  set_show_yt: jasmine.createSpy('set_show_yt'),
};

const mockThemeChangeService = {
  loadTheme: jasmine.createSpy('loadTheme'),
  setTheme: jasmine.createSpy('setTheme'),
};

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter([]),
        // { provide: Router, useValue: mockRouter },
        // { provide: ActivatedRoute, useValue: mockActivatedRoute }, // <--- FIX FOR THIS ERROR
        { provide: MatDialog, useValue: mockDialog },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: SupabaseClientService, useValue: mockSupabaseService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LearningService, useValue: mockLearningService },
        { provide: ThemeChangeService, useValue: mockThemeChangeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
