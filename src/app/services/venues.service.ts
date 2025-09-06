// services/venues.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Venue {
  id: string;
  name: string;
  keywords?: string;
  province?: string;
  city?: string;
  full_address?: string;
  street?: string;
  postal_code?: string;
  state?: string;
  country?: string;
  phone?: string;
  site?: string;
  reviews?: string;
  latitude?: number;
  longitude?: number;
  photo?: string;
  street_view?: string;
  working_hours?: string;
  business_status?: string;
  location_link?: string;
  created_at?: string;
  updated_at?: string;
}

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
      reviews
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
    venues_aggregate {
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
      reviews
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
export class VenuesService {
  constructor(private apollo: Apollo) {}

  getVenues(limit: number = 20, offset: number = 0): Observable<VenuesResponse> {
    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: GET_VENUES,
      variables: { limit, offset },
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
}
