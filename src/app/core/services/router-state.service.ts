// router-state.service.ts
import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

export interface RouteData {
  params: Record<string, any>;
  queryParams: Record<string, any>;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class RouterStateService {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  // Private signals
  private _routeData = signal<RouteData>({
    params: {},
    queryParams: {},
    url: ''
  });

  // Public computed signals
  readonly $params = computed(() => this._routeData().params);
  readonly $queryParams = computed(() => this._routeData().queryParams);
  readonly $url = computed(() => this._routeData().url);

  // Specific route data computeds
  readonly $countryCode = computed(() => this.$params()['country'] || null);
  readonly $citySlug = computed(() => this.$params()['city'] || null);
  readonly $searchQuery = computed(() => this.$queryParams()['q'] || '');
  readonly $filterType = computed(() => this.$queryParams()['type'] || null);
  readonly $isHomePage = computed(() => this.$url() === '/' || this.$url() === '');

  constructor() {
    this.initializeRouteListening();
    // Initialize with current route
    this.updateRouteData();
  }

  private initializeRouteListening(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateRouteData();
    });
  }

  private updateRouteData(): void {
    // Parse current URL to get params and query params
    const urlTree = this.router.parseUrl(this.router.url);

    // Extract params from URL segments
    const params: Record<string, any> = {};
    const segments = urlTree.root.children['primary']?.segments || [];

    // Handle patterns:
    // / (home)
    // /nl (country)
    // /nl/amsterdam (city)
    // /nl/amsterdam/venues (venues)
    // /nl/amsterdam/about (about)
    if (segments.length >= 1) {
      // First segment is country code (unless it's a non-country route)
      const firstSegment = segments[0].path;

      // Only treat as country if it looks like a country code (2-3 chars)
      if (firstSegment.length <= 3 && firstSegment.match(/^[a-z]{2,3}$/)) {
        params['country'] = firstSegment;

        // Second segment would be city
        if (segments.length >= 2) {
          const secondSegment = segments[1].path;
          // Don't treat 'venues' or 'about' as city names
          if (secondSegment !== 'venues' && secondSegment !== 'about') {
            params['city'] = secondSegment;
          }
        }
      }
    }

    this._routeData.set({
      params,
      queryParams: urlTree.queryParams,
      url: this.router.url
    });
  }
}
