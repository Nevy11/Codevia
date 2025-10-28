import { TestBed } from '@angular/core/testing';

import { GithubTriggerService } from './github-trigger.service';

describe('GithubTriggerService', () => {
  let service: GithubTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithubTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
