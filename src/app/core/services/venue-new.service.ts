import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
  buildCitySearchWhere,
  buildCountrySearchWhere,
  SEARCH_VENUES_BY_CITY,
  SEARCH_VENUES_BY_COUNTRY
} from '@core/graphql/venue-new.queries';
import {map, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Venue} from '@core/models/venue.model';

export interface SearchResponse<T> {
  items: T[],
  totalCount: number
}
@Injectable({providedIn: 'root'})
export class VenueNewService {
  constructor(private apollo: Apollo) {
  }

// Add this to your service class
  searchVenuesByCity(params: {
    countryCode: string;
    citySlug: string;
    searchTerm?: string;
    keywords?: string;
    showOnlyApproved?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<SearchResponse<Venue>> {
    const { countryCode, citySlug, searchTerm, keywords, showOnlyApproved, limit, offset } = params;

    // Only pass the parameters the helper function expects
    const where = buildCitySearchWhere({ countryCode, citySlug, searchTerm, keywords, showOnlyApproved });

    return this.apollo.query<any>({
      query: SEARCH_VENUES_BY_CITY,
      variables: { where, limit, offset },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        items: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({items: [], totalCount: 0}))
    );
  }

  searchVenuesByCountry(params: {
    countryCode: string;
    searchTerm?: string;
    keywords?: string;
    showOnlyApproved?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<SearchResponse<Venue>> {
    const { countryCode, searchTerm, keywords, showOnlyApproved, limit, offset } = params;

    const where = buildCountrySearchWhere({ countryCode, searchTerm, keywords, showOnlyApproved });

    return this.apollo.query<any>({
      query: SEARCH_VENUES_BY_COUNTRY,
      variables: { where, limit, offset },
      errorPolicy: 'ignore',
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => ({
        items: result.data?.venues || [],
        totalCount: result.data?.venues_aggregate?.aggregate?.count || 0
      })),
      catchError(() => of({ items: [], totalCount: 0 }))
    );
  }


}
