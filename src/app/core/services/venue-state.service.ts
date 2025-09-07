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
import {VenueService, VenuesResponse} from "@core/services/venue.service";

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

  // Raw data signals
  private allVenues = signal<Venue[]>([]);
  private totalCount = signal<number>(0);
  private currentCity = signal<City | null>(null);
  private venueTypes = signal<VenueType[]>([]);

  // Pagination state
  private currentPage = signal<number>(0);
  private pageSize = signal<number>(20);

  // Loading state
  private loading = signal<boolean>(false);

  // Computed signals for route-derived state
  readonly citySlug = this.routerState.citySlug;
  readonly searchQuery = this.routerState.searchQuery;
  readonly selectedFilter = this.routerState.filterType;

  // Computed signals for derived state
  readonly venues = computed(() => {
    const venues = this.allVenues();
    const search = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedFilter();

    let filtered = [...venues];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(venue =>
        venue.name?.toLowerCase().includes(search) ||
        venue.keywords?.toLowerCase().includes(search) ||
        venue.full_address?.toLowerCase().includes(search)
      );
    }

    // Apply type filter
    if (filter) {
      filtered = filtered.filter(venue =>
        venue.primary_type === filter ||
        venue.venue_types?.includes(filter)
      );
    }

    return filtered;
  });

  readonly filterOptions = computed<FilterOption[]>(() =>
    this.venueTypes().map(type => ({
      slug: type.slug,
      label: type.label,
      icon: type.icon
    }))
  );

  readonly cityName = computed(() => this.currentCity()?.name ?? '');
  readonly cityEmoji = computed(() => this.currentCity()?.emoji ?? '🏙️');
  readonly venueCount = computed(() => this.venues().length);
  readonly totalVenueCount = computed(() => this.totalCount());

  // Expose read-only state
  readonly isLoading = this.loading.asReadonly();

  constructor(
    private venueService: VenueService,
    private cityService: CityService,
    private tenantService: TenantService
  ) {
    this.initializeVenueTypes();
    this.initializeRouteEffects();
  }

  private initializeVenueTypes(): void {
    this.tenantService.getVenueTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(types => {
        this.venueTypes.set(types);
      });
  }

  private initializeRouteEffects(): void {
    // React to city changes
    effect(() => {
      const citySlug = this.citySlug();
      if (citySlug) {
        this.loadCityData(citySlug);
      } else {
        this.currentCity.set(null);
      }
    });

    // React to any route changes that should trigger venue reload
    effect(() => {
      // These dependencies will trigger the effect
      const citySlug = this.citySlug();
      const searchQuery = this.searchQuery();
      const selectedFilter = this.selectedFilter();

      // Reset pagination and load venues
      this.currentPage.set(0);
      this.loadVenues();
    });
  }

  // Public actions
  setSearchQuery(query: string): void {
    this.updateUrl({ q: query });
  }

  setFilter(filter: string | null): void {
    this.updateUrl({ type: filter });
  }

  clearFilters(): void {
    this.updateUrl({ q: null, type: null });
  }

  loadMoreVenues(): void {
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);
    this.loadVenues(false); // false = append to existing venues
  }

  refreshVenues(): void {
    this.currentPage.set(0);
    this.loadVenues(true); // true = replace existing venues
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

    this.venueService.getVenues(limit, offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: VenuesResponse) => {
          if (replace) {
            this.allVenues.set(response.venues);
          } else {
            // Append for pagination
            this.allVenues.update(current => [...current, ...response.venues]);
          }
          this.totalCount.set(response.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  private updateUrl(updates: Record<string, string | null>): void {
    const currentParams = this.routerState.queryParams();
    const queryParams: any = { ...currentParams };

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        delete queryParams[key];
      } else {
        queryParams[key] = value;
      }
    });

    const city = this.citySlug();
    const url = city ? [city, 'venues'] : ['/venues'];

    this.router.navigate(url, {
      queryParams,
      replaceUrl: true
    });
  }
}
