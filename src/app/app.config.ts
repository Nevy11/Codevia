import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideMonacoEditor({
      baseUrl: '/monaco/vs',
      defaultOptions: {
        scrollBeyondLastLine: false, // Disable scrolling beyond the last line}
        theme: 'vs-dark', // Default theme for Monaco Editor
      },
    }),
    provideHttpClient(withFetch()),
    provideHttpClientTesting(),
  ],
};
