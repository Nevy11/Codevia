import { TestBed } from '@angular/core/testing';

import { NotificiationService } from './notificiation.service';

describe('NotificiationService', () => {
  let service: NotificiationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificiationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
