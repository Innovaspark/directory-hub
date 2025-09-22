// router-state.service.ts
import { Injectable, signal, computed, inject, DestroyRef, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
  private platformId = inject(PLATFORM_ID);

  private firstNavigation = true;

  private _routeData = signal<RouteData>({
    params: {},
    queryParams: {},
    url: ''
  });

  readonly $params = computed(() => this._routeData().params);
  readonly $queryParams = computed(() => this._routeData().queryParams);
  readonly $url = computed(() => this._routeData().url);

  readonly $countryCode = computed(() => this.$params()['country'] || null);
  readonly $citySlug = computed(() => this.$params()['city'] || null);
  readonly $searchQuery = computed(() => this.$queryParams()['q'] || '');
  readonly $filterType = computed(() => this.$queryParams()['type'] || null);
  readonly $isHomePage = computed(() => this.$url() === '/' || this.$url() === '');

  private previousPath: string | null = null;

  constructor() {
    this.initializeRouteListening();
    this.updateRouteData();
  }

  private initializeRouteListening(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        // Extract path without query params or fragments
        const currentPath = event.urlAfterRedirects.split('?')[0].split('#')[0];
        if (this.previousPath !== currentPath) {
          console.log('Navigated to a new page:', currentPath);
          this.scrollToTop();
          this.previousPath = currentPath;
        } else {
          console.log('Navigation within the same page (query/fragment only)');
        }
        this.updateRouteData();

        // First browser navigation, remove 'page'
        if (this.firstNavigation && isPlatformBrowser(this.platformId)) {
          this.firstNavigation = false;
          this.removePageQueryParam();
        }
      });
  }

  private updateRouteData(): void {
    const urlTree = this.router.parseUrl(this.router.url);

    const params: Record<string, any> = {};
    const segments = urlTree.root.children['primary']?.segments || [];

    if (segments.length >= 1) {
      const firstSegment = segments[0].path;
      if (firstSegment.length <= 3 && /^[a-z]{2,3}$/.test(firstSegment)) {
        params['country'] = firstSegment;

        if (segments.length >= 2) {
          const secondSegment = segments[1].path;
          if (secondSegment !== 'venues' && secondSegment !== 'about') {
            params['city'] = secondSegment;
          }
        }
      }
    }

    const queryParams = { ...urlTree.queryParams };

    this._routeData.set({
      params,
      queryParams,
      url: this.router.url
    });
  }

  /**
   * Remove 'page' from the URL and update _routeData
   */
  removePageQueryParam(): void {
    const currentQuery = { ...this._routeData().queryParams };
    if ('page' in currentQuery) {
      delete currentQuery['page'];

      if (isPlatformBrowser(this.platformId)) {
        // Fully replace query params without merge
        this.router.navigate([], {
          queryParams: currentQuery,
          replaceUrl: true
        });
      }

      this._routeData.set({
        ...this._routeData(),
        queryParams: currentQuery
      });
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }


}
