// navigation.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {Venue} from "@core/models/venue.model";

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

  navigateToVenues(countryCode: string, citySlug: string = 'all'): void {
    // Always require country and city context - no global venues
    this.router.navigate([countryCode, citySlug, 'venues']);
  }

  navigateToVenue(countryCode: string, citySlug: string, venue: Venue): void {
    // Always require country and city context - no global venues
    this.router.navigate([countryCode, citySlug, 'venues', venue.id]);
  }

  navigateToAbout(countryCode: string, citySlug: string): void {
    this.router.navigate([countryCode, citySlug, 'about']);
  }

  // For search - always requires country context
  navigateToSearch(query: string, countryCode: string, citySlug?: string, keywords?: string): void {
    const trimmedQuery = query.trim();
    const trimmedKeywords = keywords?.trim();

    // Build query params
    const queryParams: Record<string, string> = {};
    if (trimmedQuery) {
      queryParams['q'] = trimmedQuery;
    }
    if (trimmedKeywords) {
      queryParams['keywords'] = trimmedKeywords;
    }

    if (citySlug) {
      // Search in specific city
      this.router.navigate([countryCode, citySlug, 'venues'], {
        queryParams
      });
    } else {
      // Search in all cities of country using "all"
      this.router.navigate([countryCode, 'all', 'venues'], {
        queryParams
      });
    }
  }

  // Convenience method for country-wide venue browsing
  navigateToCountryVenues(countryCode: string, queryParams?: Record<string, string>): void {
    this.router.navigate([countryCode, 'all', 'venues'], {
      queryParams: queryParams || {}
    });
  }

  navigateToReturnUrl(returnUrl: string) {
    this.router.navigateByUrl(returnUrl);
  }

  navigateToAdmin() {
    this.router.navigate(['admin']);
  }

  navigateToChild(parent: string, id: string, child: string = '') {
    this.router.navigate([parent, id, child]);
  }


}
