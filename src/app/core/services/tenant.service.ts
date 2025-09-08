// services/tenant.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Tenant, VenueType} from "@core/models/tenant.model";

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
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  constructor(private apollo: Apollo) {}

  getTenantByDomain(domain: string): Observable<Tenant | null> {
    return this.apollo.query<{tenants: Tenant[]}>({
      query: GET_TENANT_BY_DOMAIN,
      variables: { domain }
    }).pipe(
      map(result => result.data?.tenants?.[0] || null)
    );
  }

  getVenueTypes(): Observable<VenueType[]> {
    // This will eventually get from current tenant
    // For now, return hardcoded data
    return this.getTenantByDomain(window.location.hostname).pipe(
      map(tenant => tenant?.venue_types || [])
    );
  }
}
