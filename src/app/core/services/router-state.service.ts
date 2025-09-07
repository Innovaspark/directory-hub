// router-state.service.ts
import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
  readonly params = computed(() => this._routeData().params);
  readonly queryParams = computed(() => this._routeData().queryParams);
  readonly url = computed(() => this._routeData().url);

  // Specific route data computeds
  readonly citySlug = computed(() => this.params()['city'] || null);
  readonly searchQuery = computed(() => this.queryParams()['q'] || '');
  readonly filterType = computed(() => this.queryParams()['type'] || null);

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

    // Handle /:city/venues pattern
    if (segments.length >= 2 && segments[1].path === 'venues') {
      params['city'] = segments[0].path;
    }
    this._routeData.set({
      params,
      queryParams: urlTree.queryParams,
      url: this.router.url
    });
  }
}
