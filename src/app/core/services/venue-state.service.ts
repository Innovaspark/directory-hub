// venue-state.service.ts
import { Injectable, computed, signal, inject, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { RouterStateService } from './router-state.service';
import { CityService } from './city.service';
import { TenantService } from './tenant.service';
import { Venue } from '../models/venue.model';
import { City } from '../models/city.model';
import { VenueType } from '../models/venue-type.model';
import { VenueService, VenuesResponse } from "@core/services/venue.service";
import { AppStateService } from "@core/services/application-state.service";

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

  // Client-side venue type filter
  private _selectedVenueType = signal<string | null>(null);
  readonly $selectedVenueType = this._selectedVenueType.asReadonly();

  // Computed signals for route-derived state
  readonly $citySlug = this.routerState.$citySlug;
  readonly $countryCode = this.routerState.$countryCode;
  readonly $searchQuery = this.routerState.$searchQuery;
  readonly $selectedFilter = this.routerState.$filterType;

  // Search state accessors
  readonly $searchTerm = this.searchTerm.asReadonly();
  readonly $keywords = this.keywords.asReadonly();
  readonly $isSearchActive = computed(() =>
    this.searchTerm().trim().length > 0 || this.keywords().trim().length > 0
  );

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

  // Expose read-only state
  readonly $isLoading = this.loading.asReadonly();
  readonly $isLoadingMore = this.isLoadingMore.asReadonly();

  // City search state
  private citySearchTerm = signal<string>('');
  private citySuggestions = signal<City[]>([]);

  readonly $citySearchTerm = this.citySearchTerm.asReadonly();
  readonly $citySuggestions = this.citySuggestions.asReadonly();

  $viewMode = signal<'cards' | 'split'>('cards');

  constructor(
    private venueService: VenueService,
    private cityService: CityService,
    private tenantService: TenantService
  ) {
    this.initializeVenueTypes();
    this.initializeRouteEffects();
    this.loadInitialVenues();
  }

  private initializeVenueTypes(): void {
    // this.tenantService.getVenueTypes()
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(types => {
    //     this.venueTypes.set(types);
    //   });
    // alert('have to fix init venue types');
  }

  private initializeRouteEffects(): void {
    // React to city changes
    effect(() => {
      const citySlug = this.$citySlug();
      if (citySlug) {
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

  // Public search actions
  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
    this.updateUrl({ q: term || null });
  }

  setKeywords(keywords: string): void {
    this.keywords.set(keywords);
    this.updateUrl({ keywords: keywords || null });
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchResults.set([]);
    this.updateUrl({ q: null });
  }

  clearKeywords(): void {
    this.keywords.set('');
    this.updateUrl({ keywords: null });
  }

  // Public filter actions
  setFilter(filter: string | null): void {
    this.updateUrl({ type: filter });
  }

  // New client-side venue type filter method
  setVenueTypeFilter(venueType: string | null): void {
    this._selectedVenueType.set(venueType);
  }

  clearFilters(): void {
    this.updateUrl({ q: null, keywords: null, type: null });
    this._selectedVenueType.set(null);
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
    this.updateUrl({ page: nextPage.toString() });
  }

  refreshVenues(): void {
    this.currentPage.set(0);
    const searchTerm = this.searchTerm().trim();
    const keywords = this.keywords().trim();
    if (searchTerm || keywords) {
      this.performSearch(searchTerm, keywords, this.$citySlug(), true);
    } else {
      this.loadVenues(true);
    }
  }

  loadInitialVenues(): void {
    if (this.allVenues().length === 0) {
      this.loadVenues(true);
    }
  }

  // City search methods
  setCitySearchTerm(term: string): void {
    this.citySearchTerm.set(term);

    if (term.length >= 2) {
      const countryCode = this.$countryCode();

      this.cityService.searchCities(term, countryCode, 10)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(cities => {
          this.citySuggestions.set(cities);
        });
    } else {
      this.citySuggestions.set([]);
    }
  }

  selectCity(city: City): void {
    this.router.navigate([city.country?.code, city.slug, 'venues']);
    this.clearCitySearch();
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
    const queryParams: any = { ...currentParams };

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

  setViewMode(mode: "cards" | "split") {
    this.$viewMode.set(mode);
  }
}
