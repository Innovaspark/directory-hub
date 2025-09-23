import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Venue } from '@core/models/venue.model';
import * as Queries from '../graphql/venue.queries';

export interface VenuesResponse {
  venues: Venue[];
  totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class VenueService {
  constructor(private apollo: Apollo) {}

  getVenues(
    limit: number = 20,
    offset: number = 0,
    citySlug?: string,
    countryCode?: string,
    approved?: boolean // optional
  ): Observable<VenuesResponse> {
    let query = Queries.GET_VENUES;
    const variables: any = { limit, offset };

    if (citySlug && citySlug !== 'all') {
      query = Queries.GET_VENUES_BY_CITY;
      variables.citySlug = citySlug;
    } else if (countryCode) {
      query = Queries.GET_VENUES_BY_COUNTRY;
      variables.countryCode = countryCode;
    }

    if (approved === true || approved === false) {
      variables.approved = approved;
    }

    return this.apollo.query<any>({
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
    return this.apollo.query<any>({
      query: Queries.GET_VENUE_BY_ID,
      variables: { id },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => result.data?.venues_by_pk || null),
      catchError(() => of(null))
    );
  }

  getFeaturedVenues(citySlug?: string, limit: number = 3): Observable<Venue[]> {
    return this.getVenues(limit, 0, citySlug).pipe(map(response => response.venues));
  }

  getVenuesByCity(citySlug: string, limit: number = 20, offset: number = 0): Observable<VenuesResponse> {
    return this.apollo.query<any>({
      query: Queries.GET_VENUES_BY_CITY,
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

  searchVenuesByCityAndName(
    citySlug: string,
    venueName: string,
    limit: number = 20,
    offset: number = 0,
    approved?: boolean
  ): Observable<VenuesResponse> {
    const searchPattern = `%${venueName}%`;
    const variables: any = { citySlug, venueName: searchPattern, limit, offset };
    if (approved === true || approved === false) {
      variables.approved = approved;
    }

    return this.apollo.query<any>({
      query: Queries.SEARCH_VENUES_BY_CITY_AND_NAME,
      variables,
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

  searchVenuesByCityNameAndKeywords(
    citySlug: string,
    searchTerm: string,
    keywords: string = '',
    limit: number = 20,
    offset: number = 0,
    approved?: boolean
  ): Observable<VenuesResponse> {
    return this.executeSearch('city', citySlug, searchTerm, keywords, limit, offset, approved);
  }

  searchVenuesByCountryAndKeywords(
    countryCode: string,
    searchTerm: string,
    keywords: string = '',
    limit: number = 20,
    offset: number = 0,
    approved?: boolean
  ): Observable<VenuesResponse> {
    return this.executeSearch('country', countryCode, searchTerm, keywords, limit, offset, approved);
  }

  private executeSearch(
    filterType: 'city' | 'country',
    filterValue: string,
    searchTerm: string,
    keywords: string,
    limit: number,
    offset: number,
    approved?: boolean
  ): Observable<VenuesResponse> {
    const trimmedSearchTerm = searchTerm.trim();
    const trimmedKeywords = keywords.trim();

    if (trimmedSearchTerm && trimmedKeywords) {
      return this.executeSearchWithBothParams(filterType, filterValue, trimmedSearchTerm, trimmedKeywords, limit, offset, approved);
    }

    const combinedSearch = trimmedSearchTerm || trimmedKeywords;
    const searchPattern = `%${combinedSearch}%`;
    const query = filterType === 'city' ? Queries.SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS : Queries.SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS;
    const variables: any = filterType === 'city'
      ? { citySlug: filterValue, venueName: searchPattern, keywords: searchPattern, limit, offset }
      : { countryCode: filterValue, searchTerm: searchPattern, limit, offset };

    if (approved === true || approved === false) {
      variables.approved = approved;
    }

    return this.apollo.query<any>({
      query,
      variables,
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

  private executeSearchWithBothParams(
    filterType: 'city' | 'country',
    filterValue: string,
    searchTerm: string,
    keywords: string,
    limit: number,
    offset: number,
    approved?: boolean
  ): Observable<VenuesResponse> {
    const searchTermPattern = `%${searchTerm}%`;
    const keywordsPattern = `%${keywords}%`;
    const query = filterType === 'city' ? Queries.SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS : Queries.SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS;
    const variables: any = filterType === 'city'
      ? { citySlug: filterValue, venueName: searchTermPattern, keywords: keywordsPattern, limit, offset }
      : { countryCode: filterValue, searchTerm: searchTermPattern, keywords: keywordsPattern, limit, offset };

    if (approved === true || approved === false) {
      variables.approved = approved;
    }

    return this.apollo.query<any>({
      query,
      variables,
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
