import { TestBed } from '@angular/core/testing';

import { PlaybackSettingsService } from './playback-settings.service';

describe('PlaybackSettingsService', () => {
  let service: PlaybackSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaybackSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
