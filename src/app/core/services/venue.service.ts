// services/venue.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Venue} from "@core/models/venue.model";

export interface VenuesResponse {
  venues: Venue[];
  totalCount: number;
}

const GET_VENUES = gql`
 query GetVenues($limit: Int, $offset: Int) {
   venues(limit: $limit, offset: $offset, order_by: {name: asc}) {
     id
     name
     keywords
     province
     city
     full_address
     street
     postal_code
     state
     country
     phone
     site
     review_count
     review_summary
     rating
     latitude
     longitude
     photo
     street_view
     primary_type
     venue_types
     working_hours
     business_status
     location_link
     created_at
     updated_at
   }
   venues_aggregate {
     aggregate {
       count
     }
   }
 }
`;

const GET_VENUES_BY_CITY = gql`
 query GetVenuesByCity($limit: Int, $offset: Int, $city: String!) {
   venues(limit: $limit, offset: $offset, where: { city: { _eq: $city } }, order_by: {name: asc}) {
     id
     name
     keywords
     province
     city
     full_address
     street
     postal_code
     state
     country
     phone
     site
     review_count
     review_summary
     rating
     latitude
     longitude
     photo
     street_view
     primary_type
     venue_types
     working_hours
     business_status
     location_link
     created_at
     updated_at
   }
   venues_aggregate(where: { city: { _eq: $city } }) {
     aggregate {
       count
     }
   }
 }
`;

const GET_VENUE_BY_ID = gql`
 query GetVenueById($id: uuid!) {
   venues_by_pk(id: $id) {
     id
     name
     keywords
     province
     city
     full_address
     street
     postal_code
     state
     country
     phone
     site
     review_count
     review_summary
     rating
     latitude
     longitude
     photo
     street_view
     working_hours
     business_status
     location_link
     created_at
     updated_at
   }
 }
`;

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  constructor(private apollo: Apollo) {}

  getVenues(limit: number = 20, offset: number = 0, city?: string): Observable<VenuesResponse> {
    debugger;
    const query = city ? GET_VENUES_BY_CITY : GET_VENUES;
    const variables = city ? { limit, offset, city } : { limit, offset };

    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query,
      variables,
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: false
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }

  getVenueById(id: string): Observable<Venue | null> {
    return this.apollo.query<{venues_by_pk: Venue}>({
      query: GET_VENUE_BY_ID,
      variables: { id },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => result.data?.venues_by_pk || null),
      catchError(() => of(null))
    );
  }

  getFeaturedVenues(citySlug?: string, limit: number = 3): Observable<Venue[]> {
    // Hard-coded featured venues for now
    const featuredVenues: Venue[] = [
      {
        id: 'metro-chicago-001',
        name: 'Metro Chicago',
        city: 'chicago',
        state: 'IL',
        full_address: '3730 N Clark St, Chicago, IL 60613',
        street: '3730 N Clark St',
        rating: 4.2,
        review_count: 1250,
        review_summary: 'Historic music venue in Wrigleyville hosting indie, alternative, and electronic acts.',
        primary_type: 'music_venue',
        venue_types: 'club,music_venue,nightlife',
        keywords: 'indie rock,alternative,electronic,live music',
        business_status: 'OPERATIONAL'
      },
      {
        id: 'chicago-theatre-001',
        name: 'Chicago Theatre',
        city: 'chicago',
        state: 'IL',
        full_address: '175 N State St, Chicago, IL 60601',
        street: '175 N State St',
        rating: 4.5,
        review_count: 2847,
        review_summary: 'Iconic downtown theater hosting major touring acts and comedy shows.',
        primary_type: 'theater',
        venue_types: 'theater,performing_arts,entertainment',
        keywords: 'theater,comedy,concerts,live shows',
        business_status: 'OPERATIONAL'
      },
      {
        id: 'green-mill-001',
        name: 'Green Mill Cocktail Lounge',
        city: 'chicago',
        state: 'IL',
        full_address: '4802 N Broadway, Chicago, IL 60640',
        street: '4802 N Broadway',
        rating: 4.3,
        review_count: 892,
        review_summary: 'Historic jazz club operating since 1907, featuring live jazz every night.',
        primary_type: 'jazz_club',
        venue_types: 'jazz_club,bar,nightlife',
        keywords: 'jazz,blues,cocktails,historic',
        business_status: 'OPERATIONAL'
      }
    ];

    let venues = featuredVenues;

    if (citySlug) {
      venues = venues.filter(v => v.city === citySlug);
    }

    venues = venues.slice(0, limit);

    return of(venues);
  }
}
