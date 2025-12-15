import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { VideoSectionComponent } from './video-section.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

// --- Mock Services and Dependencies ---

// 1. Mock the DomSanitizer to bypass the security error (NG0904)
class MockDomSanitizer extends DomSanitizer {
  // Key method to implement for resource URLs (iframe src)
  override bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
    return value as any; // Casts the string to SafeResourceUrl for testing
  }
  // Implement all abstract methods (required by TypeScript)
  override sanitize(context: any, value: any): string {
    return value;
  }
  override bypassSecurityTrustHtml(value: string): SafeResourceUrl {
    return value as any;
  }
  override bypassSecurityTrustStyle(value: string): SafeResourceUrl {
    return value as any;
  }
  override bypassSecurityTrustScript(value: string): SafeResourceUrl {
    return value as any;
  }
  override bypassSecurityTrustUrl(value: string): SafeResourceUrl {
    return value as any;
  }
}

// 2. Mock the Supabase Client Service
const mockSupabaseService = {
  getCurrentUserId: () => Promise.resolve('test-user-123'),
  getUserVideos: () =>
    Promise.resolve([
      { video_id: 'last-watched-id', playback_position: 60 }, // Mock last watched video
    ]),
  getVideoProgress: () => Promise.resolve(0), // Not strictly needed, but good practice
  saveVideoProgress: () => Promise.resolve(),
  completeCourse: () => Promise.resolve(true),
};

// 3. Mock the Playback Settings Service
const mockPlaybackService = {
  speed$: of(1.0), // Mock the speed Observable
};

// 4. Mock the ActivatedRoute
const mockActivatedRoute = {
  // Test case 1: Video ID provided in query params
  queryParams: of({ video: 'query-param-video' }),
};

// 5. Mock the YouTube Player API (global YT object)
const mockPlayer = {
  setPlaybackRate: jasmine.createSpy('setPlaybackRate'),
  loadVideoById: jasmine.createSpy('loadVideoById'),
  getCurrentTime: () => 10,
  getDuration: () => 100,
  pauseVideo: jasmine.createSpy('pauseVideo'),
};

const mockYT = {
  PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2 },
  Player: jasmine.createSpy('Player').and.callFake((element, options) => {
    // Mimic the player creation and call onReady event immediately
    if (options.events && options.events.onReady) {
      options.events.onReady({ target: mockPlayer });
    }
    return mockPlayer;
  }),
};

// Ensure the global YT object is available in the test environment
declare var YT: any;
Object.defineProperty(window, 'YT', { value: mockYT });
// --- End Mock Services ---

describe('VideoSectionComponent', () => {
  let component: VideoSectionComponent;
  let fixture: ComponentFixture<VideoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Use the component as standalone component
      imports: [VideoSectionComponent, MatSnackBarModule],
      providers: [
        // ✅ The crucial fix: Replace DomSanitizer with the mock
        { provide: DomSanitizer, useClass: MockDomSanitizer },
        // Mock all other dependencies
        { provide: 'PlaybackSettingsService', useValue: mockPlaybackService }, // Assuming this is how it's provided if not standalone
        { provide: 'SupabaseClientService', useValue: mockSupabaseService }, // Assuming this is how it's provided if not standalone
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        // Ensure PLATFORM_ID is set to 'browser' to allow ngOnInit/AfterViewInit logic to run
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();
  });

  // This test uses fakeAsync to properly handle all Promises and Observables
  it('should create and initialize video from query params', fakeAsync(() => {
    fixture = TestBed.createComponent(VideoSectionComponent);
    component = fixture.componentInstance;

    // 1. Initial change detection triggers ngOnInit
    fixture.detectChanges();

    // 2. Resolve the getCurrentUserId promise inside ngOnInit
    tick();

    // 3. Resolve the route.queryParams subscription
    tick();

    // 4. Resolve the setSafeUrl promise (getVideoProgress)
    tick();

    // 5. Trigger ngAfterViewInit and template binding
    fixture.detectChanges();

    // Check component created successfully
    expect(component).toBeTruthy();

    // Check the videoId was correctly set from the mock queryParams
    expect(component.videoId).toBe('query-param-video');

    // Check that videoUrl was set using the sanitizer (mock returns the raw string)
    expect(component.videoUrl.toString()).toContain(
      'https://www.youtube.com/embed/query-param-video'
    );

    // Check that the YT Player was attempted to be created
    expect(mockYT.Player).toHaveBeenCalled();

    // Clean up the intervals from startProgressTracking
    // You might need a more robust way to clear intervals in real tests,
    // but for the basic 'should create' test, this is usually sufficient.
  }));

  // Example of testing the fallback logic
  it('should use the last watched video if no query param is present', fakeAsync(() => {
    // Overwrite the queryParams mock for this specific test
    const mockRouteNoParams = {
      queryParams: of({}), // Empty params
    };

    TestBed.overrideProvider(ActivatedRoute, { useValue: mockRouteNoParams });

    fixture = TestBed.createComponent(VideoSectionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // ngOnInit starts
    tick(); // Resolve getCurrentUserId
    tick(); // Resolve route.queryParams subscription (which calls getUserVideos)
    tick(); // Resolve getUserVideos promise
    tick(); // Resolve setSafeUrl promise
    fixture.detectChanges(); // Trigger template binding

    // Check that it fell back to the mock Supabase video
    expect(component.videoId).toBe('last-watched-id');
  }));
});
