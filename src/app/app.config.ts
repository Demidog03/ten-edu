import {ApplicationConfig, isDevMode, provideZonelessChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideQueryClient } from '@ngneat/query';
import { QueryClient } from '@tanstack/query-core';
import {definePreset} from '@primeuix/themes';

function browserOnlyQueryDevtools() {
  const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  if (!(inBrowser && isDevMode())) return [];
  return [{
    provide: 'NGNEAT_QUERY_DEVTOOLS_INIT',
    multi: true,
    useFactory: async () => {
      const { provideQueryDevTools } = await import('@ngneat/query-devtools');
      return provideQueryDevTools({ initialIsOpen: false });
    },
  }];
}

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}'
    },
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
      ripple: true,
    }),

    provideQueryClient(() => new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60_000, refetchOnWindowFocus: false },
      },
    })),

    ...browserOnlyQueryDevtools(),
  ],
};
