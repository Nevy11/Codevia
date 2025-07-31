import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { provideHttpClient, withFetch } from '@angular/common/http';
// import { provideServerRendering } from '@angular/ssr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
    provideMonacoEditor({
      baseUrl: '/monaco/vs',
      defaultOptions: {
        scrollBeyondLastLine: false, // Disable scrolling beyond the last line}
        theme: 'vs-dark', // Default theme for Monaco Editor
      },
    }),
    provideHttpClient(withFetch()),
    // provideServerRendering(),
  ],
};
