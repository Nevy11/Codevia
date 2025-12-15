import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { VideoSectionComponent } from './video-section.component';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { PlaybackSettingsService } from '../../settings/preferences-settings/playback-settings.service';
import { SupabaseClientService } from '../../../supabase-client.service';
import { PLATFORM_ID } from '@angular/core';

const mockActivatedRoute = {
  queryParams: of({ video: 'mockVideoId' }),
};

const mockPlaybackService = {
  speed$: of(1.0),
};

const mockSupabaseService = {
  getCurrentUserId: () => Promise.resolve('test-user-id'),
  getVideoProgress: () => Promise.resolve(0),
  getUserVideos: () =>
    Promise.resolve([{ video_id: 'mockVideoId', playback_position: 0 }]),
  completeCourse: () => Promise.resolve(true),
  saveVideoProgress: jasmine.createSpy('saveVideoProgress'),
};

const mockSnackBar = {
  open: jasmine.createSpy('open'),
};

describe('VideoSectionComponent', () => {
  let component: VideoSectionComponent;
  let fixture: ComponentFixture<VideoSectionComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSectionComponent],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PlaybackSettingsService, useValue: mockPlaybackService },
        { provide: SupabaseClientService, useValue: mockSupabaseService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoSectionComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // resolve async Promises
    fixture.detectChanges(); // re-render with videoUrl set

    expect(component).toBeTruthy();
    expect(component.videoUrl).toBeDefined();
  }));
});
