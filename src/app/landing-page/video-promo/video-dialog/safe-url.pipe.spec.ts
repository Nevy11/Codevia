// src/app/landing-page/video-promo/video-dialog/safe-url.pipe.spec.ts

import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrlPipe } from './safe-url.pipe';

describe('SafeUrlPipe', () => {
  let pipe: SafeUrlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    // TestBed.configureTestingModule is optional here, but good practice
    // if you were dealing with more complex services.

    // 1. Get the DomSanitizer instance provided by the platform.
    // We use TestBed.inject() to get the service provided by Angular's default platform.
    sanitizer = TestBed.inject(DomSanitizer);

    // 2. Instantiate the pipe, passing the required dependency (sanitizer).
    pipe = new SafeUrlPipe(sanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  // You should also add tests to verify the transform logic!
  it('should trust a resource URL', () => {
    const mockUrl = 'https://www.youtube.com/embed/video-id';
    // The actual returned object is opaque, so we just check the method call.
    const spy = spyOn(
      sanitizer,
      'bypassSecurityTrustResourceUrl'
    ).and.callThrough();

    pipe.transform(mockUrl);

    expect(spy).toHaveBeenCalledWith(mockUrl);
  });
});
