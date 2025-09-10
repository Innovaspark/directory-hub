// services/tenant.service.ts
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Tenant } from "@core/models/tenant.model";

const GET_TENANT_BY_DOMAIN = gql`
  query GetTenantByDomain($domain: String!) {
    tenants(where: { domain_names: { _contains: [$domain] } }) {
      id
      name
      slug
      description
      domain_names
      search_terms
      keywords
      venue_types
      settings
      created_at
      updated_at
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private document = inject(DOCUMENT);

  constructor(private apollo: Apollo) {}

  private getHostname(): string {
    // SSR-safe way to get hostname
    return this.document.location?.hostname || 'localhost';
  }

  getTenantByDomain(domain: string): Observable<Tenant | null> {
    return this.apollo.query<{tenants: Tenant[]}>({
      query: GET_TENANT_BY_DOMAIN,
      variables: { domain },
      errorPolicy: 'ignore',
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => result.data?.tenants?.[0] || null),
      catchError(() => of(null))
    );
  }

  getCurrentTenant(): Observable<Tenant | null> {
    const hostname = this.getHostname();
    return this.getTenantByDomain(hostname);
  }
}
