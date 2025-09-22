// venue-state.service.ts
import {Injectable, computed, signal, inject, DestroyRef, effect, EffectRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';

import {RouterStateService} from './router-state.service';
import {CityService} from '@services/city.service';
import {Venue} from '../models/venue.model';
import {City} from '../models/city.model';
import {VenueService, VenuesResponse} from "@core/services/venue.service";
import {AppStateService} from "@core/state/application-state.service";
import {catchError, Observable, of, tap} from "rxjs";
import {VenueType} from "@core/models/tenant.model";

export interface FilterOption {
  slug: string;
  label: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class VenueStateService {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private routerState = inject(RouterStateService);
  private appState = inject(AppStateService);
  private venueService = inject(VenueService);
  private cityService = inject(CityService);
  private route = inject(ActivatedRoute);

  // Raw data signals
  private allVenues = signal<Venue[]>([]);
  private searchResults = signal<Venue[]>([]);
  private totalCount = signal<number>(0);
  private currentCity = signal<City | null>(null);
  private venueTypes = signal<VenueType[]>([]);

  // Search state
  private searchTerm = signal<string>('');
  private keywords = signal<string>('');

  // Pagination state
  private currentPage = signal<number>(0);
  private pageSize = signal<number>(20);

  // Loading state
  private loading = signal<boolean>(false);
  private isLoadingMore = signal<boolean>(false);
  private lastCitySlug = null;

  // Client-side venue type filter
  private _selectedVenueType = signal<string | null>(null);
  readonly $selectedVenueType = this._selectedVenueType.asReadonly();

  // Computed signals for route-derived state
  readonly $citySlug = this.routerState.$citySlug;
  readonly $countryCode = this.routerState.$countryCode;
  readonly $searchQuery = this.routerState.$searchQuery;
  readonly $selectedFilter = this.routerState.$filterType;
  private $effectEnabled = signal(false);


  // Main venues computed signal - handles both browse and search (no server-side type filtering)
  readonly $venues = computed(() => {
    const search = this.searchTerm().trim();
    const keywordsSearch = this.keywords().trim();

    // Choose data source based on search state only
    return (search || keywordsSearch) ? this.searchResults() : this.allVenues();
  });

  // New filtered venues signal for client-side filtering
  readonly $filteredVenues = computed(() => {
    const venues = this.$venues();
    const selectedType = this.$selectedVenueType();

    if (!selectedType) {
      return venues; // Show all venues when no filter selected
    }

    // Filter venues by venue type
    return venues.filter(venue =>
      venue.venue_types?.includes(selectedType) ||
      venue.primary_type === selectedType
    );
  });

  readonly $featuredVenues = computed(() => {
    const venues = this.allVenues();
    const countryCode = this.$countryCode();
    const citySlug = this.$citySlug();

    let filtered = venues;

    // Filter by city if we're on a city page
    if (citySlug && citySlug !== 'all') {
      filtered = filtered.filter(v => v.cityByCityId?.slug === citySlug);
    }
    // Otherwise filter by country
    else if (countryCode) {
      filtered = filtered.filter(v => v.cityByCityId?.country?.code === countryCode);
    }

    return filtered.slice(0, 3);
  });

  readonly $filterOptions = computed(() => this.appState.$tenant()?.venue_types);
  readonly $cityName = computed(() => this.currentCity()?.name ?? '');
  readonly $cityEmoji = computed(() => this.currentCity()?.emoji ?? '🏙️');
  readonly $venueCount = computed(() => this.$filteredVenues().length);
  readonly $totalVenueCount = computed(() => this.totalCount());
  readonly $currentCity = computed(() => this.currentCity());

  // Expose read-only state
  readonly $isLoading = this.loading.asReadonly();
  readonly $isLoadingMore = this.isLoadingMore.asReadonly();

  // City search state
  private citySearchTerm = signal<string>('');
  private citySuggestions = signal<City[]>([]);

  $viewMode = signal<'cards' | 'map'>('cards');
  $selectedVenue = signal<Venue | null>(null);

  constructor() {
    this.initializeRouteEffects();
    this.loadInitialVenues();
  }

  private initializeRouteEffects(): void {
    // React to city changes
    effect(() => {
      const citySlug = this.$citySlug();
      if (citySlug && (citySlug != this.lastCitySlug)) {
        this.lastCitySlug = citySlug;
        this.loadCityData(citySlug);
      } else {
        this.currentCity.set(null);
      }
    });

    // React to route search query changes
    effect(() => {
      const routeSearchQuery = this.$searchQuery();
      this.searchTerm.set(routeSearchQuery);
    });

    // React to route keywords changes
    effect(() => {
      const routeKeywords = this.routerState.$queryParams()?.['keywords'] || '';
      this.keywords.set(routeKeywords);
    });

    // React to route page changes
    effect(() => {
      const routePage = this.routerState.$queryParams()?.['page'] || '0';
      const pageNumber = parseInt(routePage, 10);
      this.currentPage.set(pageNumber);
    });

    // React to search term, keywords, and route changes (removed filter dependency)
    effect(() => {
      if (!this.$effectEnabled()) return;
      const citySlug = this.$citySlug();
      const searchTerm = this.searchTerm();
      const keywords = this.keywords();
      const currentPage = this.currentPage();

      // Load appropriate data
      if (searchTerm.trim() || keywords.trim()) {
        this.performSearch(searchTerm, keywords, citySlug, currentPage === 0);
      } else {
        this.loadVenues(currentPage === 0);
      }
    });
  }

  // In your venues service
  private venueLoadingEffect?: EffectRef;

  startVenueLoading() {
    this.$effectEnabled.set(true);
  }

  stopVenueLoading() {
    this.$effectEnabled.set(false);
  }

  // New client-side venue type filter method
  setVenueTypeFilter(venueType: string | null): void {
    this._selectedVenueType.set(venueType);
  }

  // Public venue actions
  loadMoreVenues(): void {
    // Don't load more if we already have all the data
    if (this.totalCount() < this.pageSize() ||
      this.$venues().length >= this.totalCount() ||
      this.loading() ||
      this.isLoadingMore()) {
      return;
    }

    this.isLoadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    this.updateUrl({page: nextPage.toString()});
  }

  loadInitialVenues(): void {
    if (this.allVenues().length === 0) {
      this.loadVenues(true);
    }
  }

  clearCitySearch(): void {
    this.citySearchTerm.set('');
    this.citySuggestions.set([]);
  }

  // Private methods
  private loadCityData(citySlug: string): void {
    this.cityService.getCityBySlug(citySlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(city => {
        debugger;
        this.currentCity.set(city);
      });
  }

  private loadVenues(replace: boolean = true): void {
    this.loading.set(true);

    const offset = this.currentPage() * this.pageSize();
    const limit = this.pageSize();
    const citySlug = this.$citySlug();
    const countryCode = this.$countryCode();

    const actualCitySlug = citySlug === 'all' ? undefined : citySlug;

    this.venueService.getVenues(limit, offset, actualCitySlug, countryCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: VenuesResponse) => {
          if (replace) {
            this.allVenues.set(response.venues);
          } else {
            this.allVenues.update(current => [...current, ...response.venues]);
          }
          this.totalCount.set(response.totalCount);
          this.loading.set(false);
          setTimeout(() => {
            this.isLoadingMore.set(false);
          }, 1500);
        },
        error: (error) => {
          console.error('Error loading venues:', error);
          this.loading.set(false);
          this.isLoadingMore.set(false);
        }
      });
  }

  private performSearch(searchTerm: string, keywords: string, citySlug: string | null, replace: boolean = true): void {
    this.loading.set(true);

    const offset = this.currentPage() * this.pageSize();
    const limit = this.pageSize();

    // If citySlug is 'all' or null, search across all venues for the country
    if (!citySlug || citySlug === 'all') {
      const countryCode = this.$countryCode();

      if (!countryCode) {
        console.warn('Cannot search without country context');
        this.loading.set(false);
        return;
      }

      // Use server-side country-wide search with separate params
      this.venueService.searchVenuesByCountryAndKeywords(countryCode, searchTerm, keywords, limit, offset)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: VenuesResponse) => {
            if (replace) {
              this.searchResults.set(response.venues);
            } else {
              this.searchResults.update(current => [...current, ...response.venues]);
            }
            this.totalCount.set(response.totalCount);
            this.loading.set(false);
            this.isLoadingMore.set(false);
          },
          error: (error) => {
            console.error('Error searching venues by country:', error);
            this.loading.set(false);
            this.isLoadingMore.set(false);
          }
        });
      return;
    }

    // City-specific search using the existing API method with separate params
    this.venueService.searchVenuesByCityNameAndKeywords(citySlug, searchTerm, keywords, limit, offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: VenuesResponse) => {
          if (replace) {
            this.searchResults.set(response.venues);
          } else {
            this.searchResults.update(current => [...current, ...response.venues]);
          }
          this.totalCount.set(response.totalCount);
          this.loading.set(false);
          this.isLoadingMore.set(false);
        },
        error: (error) => {
          console.error('Error searching venues by city:', error);
          this.loading.set(false);
          this.isLoadingMore.set(false);
        }
      });
  }

  private updateUrl(updates: Record<string, string | null>): void {
    const currentParams = this.routerState.$queryParams();
    const queryParams: any = {...currentParams};

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        delete queryParams[key];
      } else {
        queryParams[key] = value;
      }
    });

    // Just update query params, stay on current route
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  private updateUrlFull(updates: Record<string, string | null>): void {
    const currentParams = this.routerState.$queryParams();
    const queryParams: any = {...currentParams};

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        delete queryParams[key];
      } else {
        queryParams[key] = value;
      }
    });

    // Build the correct URL based on current context
    const countryCode = this.$countryCode();
    const citySlug = this.$citySlug();

    let url: string[];
    if (countryCode && citySlug) {
      url = [countryCode, citySlug, 'venues'];
    } else if (countryCode) {
      url = [countryCode, 'all', 'venues'];
    } else {
      url = ['/'];
    }

    this.router.navigate(url, {
      queryParams,
      replaceUrl: true
    });
  }

  setViewMode(mode: "cards" | "map") {
    this.$viewMode.set(mode);
  }

  selectVenue(venue: Venue) {
    this.$selectedVenue.set(venue);
  }

  clearSelectedVenue() {
    this.$selectedVenue.set(null);
  }

// Current venue signals
  private currentVenue = signal<Venue | null>(null);
  private currentVenueLoading = signal<boolean>(false);
  private currentVenueError = signal<string | null>(null);

// Public readonly accessors
  readonly $currentVenue = this.currentVenue.asReadonly();
  readonly $currentVenueLoading = this.currentVenueLoading.asReadonly();
  readonly $currentVenueError = this.currentVenueError.asReadonly();

// Load current venue method
  loadCurrentVenue(venueId: string): Observable<Venue | null> {
    this.currentVenueLoading.set(true);
    this.currentVenueError.set(null);

    return this.venueService.getVenueById(venueId).pipe(
      tap(venue => {
        this.currentVenue.set(venue);
        this.currentVenueLoading.set(false);

        // Set error if venue not found
        if (!venue) {
          this.currentVenueError.set('Venue not found');
        }
      }),
      catchError(error => {
        this.currentVenueLoading.set(false);
        this.currentVenueError.set('Failed to load venue details');
        console.error('Error loading venue:', error);
        return of(null);
      })
    );
  }

// Clear current venue (useful for cleanup)
  clearCurrentVenue(): void {
    this.currentVenue.set(null);
    this.currentVenueError.set(null);
    this.currentVenueLoading.set(false);
  }


}
