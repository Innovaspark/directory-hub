// navigation.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToCountry(countryCode: string): void {
    this.router.navigate([countryCode]);
  }

  navigateToCity(countryCode: string, citySlug: string): void {
    this.router.navigate([countryCode, citySlug]);
  }

  navigateToVenues(countryCode: string, citySlug: string): void {
    // Always require country and city context - no global venues
    this.router.navigate([countryCode, citySlug, 'venues']);
  }

  navigateToAbout(countryCode: string, citySlug: string): void {
    this.router.navigate([countryCode, citySlug, 'about']);
  }

  // For search - always requires country context
  navigateToSearch(query: string, countryCode: string, citySlug?: string): void {
    const trimmedQuery = query.trim();

    if (citySlug) {
      // Search in specific city
      this.router.navigate([countryCode, citySlug, 'venues'], {
        queryParams: trimmedQuery ? { q: trimmedQuery } : {}
      });
    } else {
      // Search in all cities of country using "all"
      this.router.navigate([countryCode, 'all', 'venues'], {
        queryParams: trimmedQuery ? { q: trimmedQuery } : {}
      });
    }
  }

  // Convenience method for country-wide venue browsing
  navigateToCountryVenues(countryCode: string, queryParams?: Record<string, string>): void {
    this.router.navigate([countryCode, 'all', 'venues'], {
      queryParams: queryParams || {}
    });
  }
}
