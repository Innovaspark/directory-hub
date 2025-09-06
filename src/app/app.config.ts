import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import {provideApolloConfig} from "./apollo.config";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    ...provideApolloConfig()
    // provideApollo(() => {
    //   const httpLink = inject(HttpLink);
    //
    //   return {
    //     link: httpLink.create({
    //       uri: '<%= endpoint %>',
    //     }),
    //     cache: new InMemoryCache(),
    //   };
    // })
  ]
};

