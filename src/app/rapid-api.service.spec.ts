import { TestBed } from '@angular/core/testing';

import { RapidApiService } from './rapid-api.service';

describe('RapidApiService', () => {
  let service: RapidApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RapidApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
