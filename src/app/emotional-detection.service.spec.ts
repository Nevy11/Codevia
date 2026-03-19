import { TestBed } from '@angular/core/testing';

import { EmotionalDetectionService } from './emotional-detection.service';

describe('EmotionalDetectionService', () => {
  let service: EmotionalDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionalDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
