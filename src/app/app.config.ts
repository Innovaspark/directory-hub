import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {provideApolloConfig} from "./apollo.config";
import {AppStateService} from "@core/services/application-state.service";
import {environment} from "../environments/environment";
import {provideMapboxGL} from "ngx-mapbox-gl";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    ...provideApolloConfig(),
    provideAppInitializer(() => {
      const appState = inject(AppStateService);
      return appState.initializeTenant();
    }),
    provideMapboxGL({
      accessToken: environment.mapboxToken,
    }),
  ]
};



