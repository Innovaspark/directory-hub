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
     cityByCityId {
       id
       name
       slug
       is_live
       country {
         code
         name
       }
     }
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
 query GetVenuesByCity($limit: Int, $offset: Int, $citySlug: String!) {
   venues(
     limit: $limit, 
     offset: $offset, 
     where: { cityByCityId: { slug: { _eq: $citySlug } } },
     order_by: {name: asc}
   ) {
     id
     name
     keywords
     province
     cityByCityId {
       id
       name
       slug
       is_live
       country {
         code
         name
       }
     }
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
   venues_aggregate(where: { cityByCityId: { slug: { _eq: $citySlug } } }) {
     aggregate {
       count
     }
   }
 }
`;

const GET_VENUES_BY_COUNTRY = gql`
 query GetVenuesByCountry($limit: Int, $offset: Int, $countryCode: String!) {
   venues(
     limit: $limit, 
     offset: $offset, 
     where: { cityByCityId: { country: { code: { _eq: $countryCode } } } },
     order_by: {name: asc}
   ) {
     id
     name
     keywords
     province
     cityByCityId {
       id
       name
       slug
       is_live
       country {
         code
         name
       }
     }
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
   venues_aggregate(where: { cityByCityId: { country: { code: { _eq: $countryCode } } } }) {
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
     cityByCityId {
       id
       name
       slug
       is_live
       country {
         code
         name
       }
     }
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

  getVenues(limit: number = 20, offset: number = 0, citySlug?: string, countryCode?: string): Observable<VenuesResponse> {
    let query = GET_VENUES;
    let variables: any = { limit, offset };

    if (citySlug && citySlug !== 'all') {
      query = GET_VENUES_BY_CITY;
      variables.citySlug = citySlug;
    } else if (countryCode) {
      query = GET_VENUES_BY_COUNTRY;
      variables.countryCode = countryCode;
    }

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
    // This will use the same filtering logic as getVenues
    return this.getVenues(limit, 0, citySlug).pipe(
      map(response => response.venues)
    );
  }
}
