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

// Search queries
const SEARCH_VENUES_BY_CITY_AND_NAME = gql`
 query SearchVenuesByCityAndName($citySlug: String!, $venueName: String!, $limit: Int, $offset: Int) {
   venues(
     limit: $limit,
     offset: $offset,
     where: { 
       _and: [
         { cityByCityId: { slug: { _eq: $citySlug } } },
         { name: { _ilike: $venueName } }
       ]
     },
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
   venues_aggregate(where: { 
     _and: [
       { cityByCityId: { slug: { _eq: $citySlug } } },
       { name: { _ilike: $venueName } }
     ]
   }) {
     aggregate {
       count
     }
   }
 }
`;

const SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS = gql`
 query SearchVenuesByCityNameAndKeywords($citySlug: String!, $venueName: String, $keywords: String, $limit: Int, $offset: Int) {
   venues(
     limit: $limit,
     offset: $offset,
     where: { 
       _and: [
         { cityByCityId: { slug: { _eq: $citySlug } } },
         {
           _or: [
             { name: { _ilike: $venueName } },
             { keywords: { _ilike: $keywords } }
           ]
         }
       ]
     },
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
   venues_aggregate(where: { 
     _and: [
       { cityByCityId: { slug: { _eq: $citySlug } } },
       {
         _or: [
           { name: { _ilike: $venueName } },
           { keywords: { _ilike: $keywords } }
         ]
       }
     ]
   }) {
     aggregate {
       count
     }
   }
 }
`;

const SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS = gql`
 query SearchVenuesByCountryAndKeywords($countryCode: String!, $searchTerm: String!, $limit: Int, $offset: Int) {
   venues(
     limit: $limit,
     offset: $offset,
     where: { 
       _and: [
         { cityByCityId: { country: { code: { _eq: $countryCode } } } },
         {
           _or: [
             { name: { _ilike: $searchTerm } },
             { keywords: { _ilike: $searchTerm } }
           ]
         }
       ]
     },
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
   venues_aggregate(where: { 
     _and: [
       { cityByCityId: { country: { code: { _eq: $countryCode } } } },
       {
         _or: [
           { name: { _ilike: $searchTerm } },
           { keywords: { _ilike: $searchTerm } }
         ]
       }
     ]
   }) {
     aggregate {
       count
     }
   }
 }
`;

// NEW: Queries for when both search term AND keywords are provided
const SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS = gql`
 query SearchVenuesByCityWithBothParams($citySlug: String!, $venueName: String!, $keywords: String!, $limit: Int, $offset: Int) {
   venues(
     limit: $limit,
     offset: $offset,
     where: { 
       _and: [
         { cityByCityId: { slug: { _eq: $citySlug } } },
         { name: { _ilike: $venueName } },
         { keywords: { _ilike: $keywords } }
       ]
     },
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
   venues_aggregate(where: { 
     _and: [
       { cityByCityId: { slug: { _eq: $citySlug } } },
       { name: { _ilike: $venueName } },
       { keywords: { _ilike: $keywords } }
     ]
   }) {
     aggregate {
       count
     }
   }
 }
`;

const SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS = gql`
 query SearchVenuesByCountryWithBothParams($countryCode: String!, $searchTerm: String!, $keywords: String!, $limit: Int, $offset: Int) {
   venues(
     limit: $limit,
     offset: $offset,
     where: { 
       _and: [
         { cityByCityId: { country: { code: { _eq: $countryCode } } } },
         { name: { _ilike: $searchTerm } },
         { keywords: { _ilike: $keywords } }
       ]
     },
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
   venues_aggregate(where: { 
     _and: [
       { cityByCityId: { country: { code: { _eq: $countryCode } } } },
       { name: { _ilike: $searchTerm } },
       { keywords: { _ilike: $keywords } }
     ]
   }) {
     aggregate {
       count
     }
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
    return this.getVenues(limit, 0, citySlug).pipe(
      map(response => response.venues)
    );
  }

  /**
   * Get all venues for a specific city
   */
  getVenuesByCity(citySlug: string, limit: number = 20, offset: number = 0): Observable<VenuesResponse> {
    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: GET_VENUES_BY_CITY,
      variables: { citySlug, limit, offset },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }

  /**
   * Search venues by city and partial venue name
   */
  searchVenuesByCityAndName(
    citySlug: string,
    venueName: string,
    limit: number = 20,
    offset: number = 0
  ): Observable<VenuesResponse> {
    const searchPattern = `%${venueName}%`;

    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: SEARCH_VENUES_BY_CITY_AND_NAME,
      variables: {
        citySlug,
        venueName: searchPattern,
        limit,
        offset
      },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }

  /**
   * Search venues by city, partial venue name and/or keywords (UPDATED)
   */
  searchVenuesByCityNameAndKeywords(
    citySlug: string,
    searchTerm: string,
    keywords: string = '',
    limit: number = 20,
    offset: number = 0
  ): Observable<VenuesResponse> {
    // If both are provided, we need a more complex query
    if (searchTerm.trim() && keywords.trim()) {
      return this.searchVenuesByCityWithBothParams(citySlug, searchTerm, keywords, limit, offset);
    }

    // If only one is provided, use the existing logic
    const combinedSearch = searchTerm.trim() || keywords.trim();
    const searchPattern = `%${combinedSearch}%`;

    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS,
      variables: {
        citySlug,
        venueName: searchPattern,
        keywords: searchPattern,
        limit,
        offset
      },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }

  /**
   * Search venues by country and keywords (UPDATED)
   */
  searchVenuesByCountryAndKeywords(
    countryCode: string,
    searchTerm: string,
    keywords: string = '',
    limit: number = 20,
    offset: number = 0
  ): Observable<VenuesResponse> {
    // If both are provided, we need a more complex query
    if (searchTerm.trim() && keywords.trim()) {
      return this.searchVenuesByCountryWithBothParams(countryCode, searchTerm, keywords, limit, offset);
    }

    // If only one is provided, use the existing logic
    const combinedSearch = searchTerm.trim() || keywords.trim();
    const searchPattern = `%${combinedSearch}%`;

    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS,
      variables: {
        countryCode,
        searchTerm: searchPattern,
        limit,
        offset
      },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }

  /**
   * NEW: Search venues by city with both name AND keywords (both must match)
   */
  private searchVenuesByCityWithBothParams(
    citySlug: string,
    searchTerm: string,
    keywords: string,
    limit: number,
    offset: number
  ): Observable<VenuesResponse> {
    const venueNamePattern = `%${searchTerm}%`;
    const keywordsPattern = `%${keywords}%`;

    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS,
      variables: {
        citySlug,
        venueName: venueNamePattern,
        keywords: keywordsPattern,
        limit,
        offset
      },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }

  /**
   * NEW: Search venues by country with both name AND keywords (both must match)
   */
  private searchVenuesByCountryWithBothParams(
    countryCode: string,
    searchTerm: string,
    keywords: string,
    limit: number,
    offset: number
  ): Observable<VenuesResponse> {
    const searchTermPattern = `%${searchTerm}%`;
    const keywordsPattern = `%${keywords}%`;

    return this.apollo.query<{
      venues: Venue[];
      venues_aggregate: { aggregate: { count: number } };
    }>({
      query: SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS,
      variables: {
        countryCode,
        searchTerm: searchTermPattern,
        keywords: keywordsPattern,
        limit,
        offset
      },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        venues: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ venues: [], totalCount: 0 }))
    );
  }
}
