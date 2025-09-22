import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer, PLATFORM_ID
} from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {provideApolloConfig} from "./apollo.config";
import {AppStateService} from "@core/state/application-state.service";
import { provideFormlyCore } from '@ngx-formly/core'
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import {RepeatTypeComponent} from '@components/formly/repeat-type';
import {provideToastr} from 'ngx-toastr';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideMapboxGL} from 'ngx-mapbox-gl';
import {environment} from '@environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

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
    provideFormlyCore([
      ...withFormlyBootstrap(),
      {
        types: [{ name: 'repeat', component: RepeatTypeComponent }],
        validationMessages: [{ name: 'required', message: 'This field is required' }],
      },
    ]),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    {
      provide: DeviceDetectorService,
      useFactory: (platformId: Object) => new DeviceDetectorService(platformId),
      deps: [PLATFORM_ID]
    }

  ]
};



