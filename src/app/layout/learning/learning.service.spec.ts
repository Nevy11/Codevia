// learning.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { LearningService } from './learning.service';

// 1. Change the import: Import the new function instead of the NgModule
//    (You might also need to import 'provideHttpClient' if your service uses it, but
//     usually 'provideHttpClientTesting' includes necessary mocks)
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LearningService', () => {
  let service: LearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 2. Remove the 'imports: [HttpClientTestingModule]' array completely.

      // 3. Add the new functions to the 'providers' array.
      providers: [
        // This is often needed if the service depends on HttpClient itself
        provideHttpClient(),
        // This adds the testing controller and mocks the backend
        provideHttpClientTesting(),
      ],
    });

    // The service can now be successfully created
    service = TestBed.inject(LearningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Note: For other tests, you can now inject HttpTestingController:
  // let controller: HttpTestingController;
  // beforeEach(() => { controller = TestBed.inject(HttpTestingController); });
});
