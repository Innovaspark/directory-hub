import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { City } from '../models/city.model';

export interface CitiesResponse {
  cities: City[];
  totalCount: number;
}

// GraphQL Queries - Using is_live everywhere
const GET_CITIES = gql`
  query GetCities($limit: Int, $offset: Int) {
    cities(
      limit: $limit,
      offset: $offset,
      where: { is_live: { _eq: true } },
      order_by: { name: asc }
    ) {
      id
      name
      slug
      country_id
      emoji
      venue_count
      is_live
      created_at
      updated_at
      country {
        id
        code
        name
      }
    }
    cities_aggregate(where: { is_live: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const GET_CITY_BY_SLUG = gql`
  query GetCityBySlug($slug: String!) {
    cities(where: { slug: { _eq: $slug }, is_live: { _eq: true } }) {
      id
      name
      slug
      country_id
      emoji
      venue_count
      is_live
      created_at
      updated_at
      country {
        id
        code
        name
      }
      description
      content
      photos
    }
  }
`;

const GET_CITIES_BY_COUNTRY = gql`
  query GetCitiesByCountry($countryCode: String!, $limit: Int, $offset: Int) {
    cities(
      limit: $limit,
      offset: $offset,
      where: {
        country: { code: { _eq: $countryCode } },
        is_live: { _eq: true }
      },
      order_by: { name: asc }
    ) {
      id
      name
      slug
      country_id
      emoji
      venue_count
      is_live
      created_at
      updated_at
      country {
        id
        code
        name
      }
    }
    cities_aggregate(where: {
      country: { code: { _eq: $countryCode } },
      is_live: { _eq: true }
    }) {
      aggregate {
        count
      }
    }
  }
`;

// Add this GraphQL query to your existing queries
const SEARCH_CITIES = gql`
  query SearchCities($searchTerm: String!, $countryCode: String, $limit: Int) {
    cities(
      limit: $limit,
      where: {
        _and: [
          { name: { _ilike: $searchTerm } },
          { is_live: { _eq: true } },
          { country: { code: { _eq: $countryCode } } }
        ]
      },
      order_by: { name: asc }
    ) {
      id
      name
      slug
      country_id
      emoji
      venue_count
      country {
        id
        code
        name
      }
    }
  }
`;

const SEARCH_CITIES_ALL_COUNTRIES = gql`
  query SearchCitiesAllCountries($searchTerm: String!, $limit: Int) {
    cities(
      limit: $limit,
      where: {
        _and: [
          { name: { _ilike: $searchTerm } },
          { is_live: { _eq: true } }
        ]
      },
      order_by: { name: asc }
    ) {
      id
      name
      slug
      country_id
      emoji
      venue_count
      country {
        id
        code
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private apollo: Apollo) {}

  getCities(limit: number = 20, offset: number = 0): Observable<CitiesResponse> {
    return this.apollo.query<{
      cities: City[];
      cities_aggregate: { aggregate: { count: number } };
    }>({
      query: GET_CITIES,
      variables: { limit, offset },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        cities: result.data?.cities || [],
        totalCount: result.data?.cities_aggregate?.aggregate?.count || 0
      })),
      catchError(error => {
        console.error('Error loading cities:', error);
        return of({ cities: [], totalCount: 0 });
      })
    );
  }

  getCitiesByCountry(countryCode: string, limit: number = 20, offset: number = 0): Observable<CitiesResponse> {
    return this.apollo.query<{
      cities: City[];
      cities_aggregate: { aggregate: { count: number } };
    }>({
      query: GET_CITIES_BY_COUNTRY,
      variables: { countryCode, limit, offset },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        cities: result.data?.cities || [],
        totalCount: result.data?.cities_aggregate?.aggregate?.count || 0
      })),
      catchError(error => {
        console.error('Error loading cities by country:', error);
        return of({ cities: [], totalCount: 0 });
      })
    );
  }

  getCityBySlug(slug: string): Observable<City | null> {
    return this.apollo.query<{cities: City[]}>({
      query: GET_CITY_BY_SLUG,
      variables: { slug },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => result.data?.cities?.[0] || null),
      catchError(error => {
        console.error('Error loading city by slug:', error);
        return of(null);
      })
    );
  }

  validateCountryCity(countryCode: string, citySlug: string): Observable<boolean> {
    return this.getCityBySlug(citySlug).pipe(
      map(cityData => {
        return !!(cityData && cityData.country?.code === countryCode && cityData.is_live);
      })
    );
  }

  searchCities(searchTerm: string, countryCode?: string, limit: number = 10): Observable<City[]> {
    const searchPattern = `%${searchTerm}%`;

    return this.apollo.query<{cities: City[]}>({
      query: SEARCH_CITIES,
      variables: {
        searchTerm: searchPattern,
        countryCode,
        limit
      },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => result.data?.cities || []),
      catchError(error => {
        console.error('Error searching cities:', error);
        return of([]);
      })
    );
  }
}
