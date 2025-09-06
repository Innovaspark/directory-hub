import { ApplicationConfig, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';

export function provideApolloConfig(): ApplicationConfig['providers'] {
  return [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const uri = httpLink.create({
        uri: environment.hasuraEndpoint,
      });

      const authLink = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          'X-Hasura-Admin-Secret': environment.hasuraAdminSecret,
          'Content-Type': 'application/json',
        },
      }));

      return {
        link: authLink.concat(uri),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            errorPolicy: 'all',
          },
        },
      };
    }),
  ];
}
