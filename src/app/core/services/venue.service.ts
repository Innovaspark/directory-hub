import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {firstValueFrom, Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Venue} from '@core/models/venue.model';
import * as Queries from '../graphql/venue.queries';
import {BULK_UPDATE_VENUES} from '../graphql/venue.queries';

export interface VenuesResponse {
  venues: Venue[];
  totalCount: number;
}

export interface VenueUpdateInput {
  id: string;
  approved: boolean;
  description: string;
  venueTypes: string[];
  primary_type: string;
  keywords: string[];
  content: string;
}

interface BulkUpdateResult {
  success: boolean;
  affected_rows: number;
  venues: any[];
  error?: string;
}

interface UpdateVenuesManyResult {
  update_venues_many: {
    affected_rows: number;
    returning: any[];
  };
}

function transformToHasuraUpdates(venues: VenueUpdateInput[]) {
  return venues.map(venue => ({
    where: { id: { _eq: venue.id } },
    _set: {
      approved: venue.approved,
      description: venue.description,
      venue_types: venue.venueTypes,
      primary_type: venue.primary_type,
      keywords: venue.keywords,
      content: venue.content
    }
  }));
}

@Injectable({providedIn: 'root'})
export class VenueService {
  constructor(private apollo: Apollo) {
  }

  getVenues(
    limit: number = 20,
    offset: number = 0,
    citySlug?: string,
    countryCode?: string,
    approved?: boolean
  ): Observable<VenuesResponse> {
    let query;
    const variables: any = {limit, offset};

    if (citySlug && citySlug !== 'all') {
      if (approved === true || approved === false) {
        query = Queries.GET_VENUES_BY_CITY_APPROVED;
        variables.citySlug = citySlug;
        variables.approved = approved;
      } else {
        query = Queries.GET_VENUES_BY_CITY;
        variables.citySlug = citySlug;
      }
    } else if (countryCode) {
      if (approved === true || approved === false) {
        query = Queries.GET_VENUES_BY_COUNTRY_APPROVED;
        variables.countryCode = countryCode;
        variables.approved = approved;
      } else {
        query = Queries.GET_VENUES_BY_COUNTRY;
        variables.countryCode = countryCode;
      }
    } else {
      if (approved === true || approved === false) {
        query = Queries.GET_VENUES_APPROVED;
        variables.approved = approved;
      } else {
        query = Queries.GET_VENUES;
      }
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
      catchError(() => of({venues: [], totalCount: 0}))
    );
  }

  getVenueById(id: string): Observable<Venue | null> {
    return this.apollo.query<any>({
      query: Queries.GET_VENUE_BY_ID,
      variables: {id},
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => result.data?.venues_by_pk || null),
      catchError(() => of(null))
    );
  }

  getFeaturedVenues(citySlug?: string, limit: number = 3, approved?: boolean): Observable<Venue[]> {
    return this.getVenues(limit, 0, citySlug, undefined, approved).pipe(
      map(response => response.venues)
    );
  }

  getVenuesByCity(citySlug: string, limit: number = 20, offset: number = 0, approved?: boolean): Observable<VenuesResponse> {
    const query = (approved === true || approved === false)
      ? Queries.GET_VENUES_BY_CITY_APPROVED
      : Queries.GET_VENUES_BY_CITY;

    const variables: any = {citySlug, limit, offset};
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
      catchError(() => of({venues: [], totalCount: 0}))
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
    const query = (approved === true || approved === false)
      ? Queries.SEARCH_VENUES_BY_CITY_AND_NAME_APPROVED
      : Queries.SEARCH_VENUES_BY_CITY_AND_NAME;

    const variables: any = {citySlug, venueName: searchPattern, limit, offset};
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
      catchError(() => of({venues: [], totalCount: 0}))
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

    let query;
    if (filterType === 'city') {
      query = (approved === true || approved === false)
        ? Queries.SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS_APPROVED
        : Queries.SEARCH_VENUES_BY_CITY_NAME_AND_KEYWORDS;
    } else {
      query = (approved === true || approved === false)
        ? Queries.SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS_APPROVED
        : Queries.SEARCH_VENUES_BY_COUNTRY_AND_KEYWORDS;
    }

    const variables: any = filterType === 'city'
      ? {citySlug: filterValue, venueName: searchPattern, keywords: searchPattern, limit, offset}
      : {countryCode: filterValue, searchTerm: searchPattern, limit, offset};

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
      catchError(() => of({venues: [], totalCount: 0}))
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

    let query;
    if (filterType === 'city') {
      query = (approved === true || approved === false)
        ? Queries.SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS_APPROVED
        : Queries.SEARCH_VENUES_BY_CITY_WITH_BOTH_PARAMS;
    } else {
      query = (approved === true || approved === false)
        ? Queries.SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS_APPROVED
        : Queries.SEARCH_VENUES_BY_COUNTRY_WITH_BOTH_PARAMS;
    }

    const variables: any = filterType === 'city'
      ? {citySlug: filterValue, venueName: searchTermPattern, keywords: keywordsPattern, limit, offset}
      : {countryCode: filterValue, searchTerm: searchTermPattern, keywords: keywordsPattern, limit, offset};

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
      catchError(() => of({venues: [], totalCount: 0}))
    );
  }

  async bulkUpdateVenues(venues: VenueUpdateInput[]): Promise<BulkUpdateResult> {
    const updates = transformToHasuraUpdates(venues);

    try {
      const result = await firstValueFrom(this.apollo.mutate<UpdateVenuesManyResult>({
        mutation: BULK_UPDATE_VENUES,
        variables: { updates },
        errorPolicy: 'ignore'
      }));

      return {
        success: true,
        affected_rows: result.data?.update_venues_many?.affected_rows || 0,
        venues: result.data?.update_venues_many?.returning || []
      };
    } catch (error: any) {
      console.error('Bulk update failed:', error);
      return {
        success: false,
        error: error.message,
        affected_rows: 0,
        venues: []
      };
    }
  }
}
