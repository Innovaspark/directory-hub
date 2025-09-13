// services/tenant.service.ts
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Tenant, VenueType} from "@core/models/tenant.model";

// SEO and content constants
const DEFAULT_KEYWORDS = [
  'live music', 'concerts', 'music venues', 'open mic', 'jam sessions',
  'live bands', 'music events', 'jazz clubs', 'rock venues', 'acoustic nights',
  'blues nights', 'folk music', 'indie concerts', 'singer songwriter',
  'Netherlands music', 'Dutch venues', 'concert halls', 'music bars'
];

const DEFAULT_VENUE_TYPES = [
  'music_venue', 'jazz_club', 'rock_venue', 'acoustic_venue',
  'concert_hall', 'bar_with_music', 'cafe_music', 'club',
  'theater', 'cultural_center', 'festival_ground'
];

const DEFAULT_SEARCH_TERMS = [
  'live music', 'concerts', 'open mic', 'jam session', 'live bands',
  'music events', 'acoustic', 'jazz', 'rock', 'indie', 'folk', 'blues'
];

const DEFAULT_CONTENT_TYPES = [
  'website', 'article', 'place', 'profile', 'music.event', 'music.musician'
];

const DEFAULT_SOCIAL_PLATFORMS = [
  'facebook', 'instagram', 'twitter', 'youtube', 'spotify', 'bandcamp'
];

const DEFAULT_EVENT_TYPES = [
  'live_band', 'open_mic', 'jam_session', 'acoustic_night', 'jazz_night',
  'rock_show', 'indie_concert', 'folk_evening', 'blues_night', 'singer_songwriter'
];

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

export interface TenantSeoConfig {
  siteName: string;
  defaultKeywords: string[];
  venueTypes: string[];
  searchTerms: string[];
  contentTypes: string[];
  eventTypes: string[];
  socialPlatforms: string[];
  locale: string;
  defaultImage: string;
  domain: string;
  twitterSite?: string;
  description?: string;
}

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

  /** Get SEO configuration for current tenant */
  getTenantSeoConfig(): Observable<TenantSeoConfig> {
    return this.getCurrentTenant().pipe(
      map(tenant => this.buildSeoConfig(tenant))
    );
  }

  /** Build SEO configuration from tenant data */
  private buildSeoConfig(tenant: Tenant | null): TenantSeoConfig {
    if (!tenant) {
      return this.getFallbackSeoConfig();
    }

    return {
      siteName: tenant.name || 'DirectoryHub',
      defaultKeywords: this.parseKeywords(tenant.keywords || tenant.search_terms) || DEFAULT_KEYWORDS,
      venueTypes: this.parseVenueTypes(tenant.venue_types),
      searchTerms: tenant.search_terms || DEFAULT_SEARCH_TERMS,
      contentTypes: DEFAULT_CONTENT_TYPES, // These are Open Graph types, not stored in DB
      eventTypes: DEFAULT_EVENT_TYPES,
      socialPlatforms: DEFAULT_SOCIAL_PLATFORMS,
      locale: 'nl_NL', // Default for Netherlands
      defaultImage: '/assets/images/default-og-image.jpg',
      domain: tenant.domain_names?.[0] || 'localhost',
      description: tenant.description,
      twitterSite: tenant.slug ? `@${tenant.slug}` : undefined
    };
  }

  /** Parse keywords from various input formats */
  private parseKeywords(keywords: string[] | string | null): string[] {
    if (!keywords) return DEFAULT_KEYWORDS;
    if (Array.isArray(keywords)) return keywords;
    if (typeof keywords === 'string') {
      return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
    return DEFAULT_KEYWORDS;
  }

  /** Parse venue types from VenueType objects to strings */
  private parseVenueTypes(venueTypes: VenueType[] | null): string[] {
    if (!venueTypes || !Array.isArray(venueTypes)) {
      return DEFAULT_VENUE_TYPES;
    }

    // Extract slugs from VenueType objects
    return venueTypes.map(vt => vt.slug).filter(slug => slug && slug.length > 0);
  }

  /** Parse search terms from various input formats */
  private parseSearchTerms(searchTerms: string[] | string | null): string[] {
    if (!searchTerms) return DEFAULT_SEARCH_TERMS;
    if (Array.isArray(searchTerms)) return searchTerms;
    if (typeof searchTerms === 'string') {
      return searchTerms.split(',').map(st => st.trim()).filter(st => st.length > 0);
    }
    return DEFAULT_SEARCH_TERMS;
  }

  /** Get fallback configuration when no tenant is found */
  private getFallbackSeoConfig(): TenantSeoConfig {
    return {
      siteName: 'DirectoryHub',
      defaultKeywords: DEFAULT_KEYWORDS,
      venueTypes: DEFAULT_VENUE_TYPES,
      searchTerms: DEFAULT_SEARCH_TERMS,
      contentTypes: DEFAULT_CONTENT_TYPES,
      eventTypes: DEFAULT_EVENT_TYPES,
      socialPlatforms: DEFAULT_SOCIAL_PLATFORMS,
      locale: 'nl_NL',
      defaultImage: '/assets/images/default-og-image.jpg',
      domain: 'localhost'
    };
  }

  /** Get default keywords (for external use) */
  getDefaultKeywords(): string[] {
    return [...DEFAULT_KEYWORDS];
  }

  /** Get default venue types (for external use) */
  getDefaultVenueTypes(): string[] {
    return [...DEFAULT_VENUE_TYPES];
  }

  /** Get default search terms (for external use) */
  getDefaultSearchTerms(): string[] {
    return [...DEFAULT_SEARCH_TERMS];
  }

  /** Get default content types (for external use) */
  getDefaultContentTypes(): string[] {
    return [...DEFAULT_CONTENT_TYPES];
  }

  /** Get default event types (for external use) */
  getDefaultEventTypes(): string[] {
    return [...DEFAULT_EVENT_TYPES];
  }
}
