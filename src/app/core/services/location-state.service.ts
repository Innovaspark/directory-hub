// location-state.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { RouterStateService } from './router-state.service';

export interface Country {
  code: string;
  name: string;
  emoji: string;
  slug: string;
  description: string;
  capital?: string;
  population?: number;
  language?: string;
  currency?: string;
  timezone?: string;
}

export interface City {
  slug: string;
  name: string;
  countryCode: string;
  emoji: string;
  venueCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationStateService {
  private routerState = inject(RouterStateService);

  // MVP hardcoded data - will become API calls later
  private countries = signal<Country[]>([
    {
      code: 'nl',
      name: 'Netherlands',
      emoji: '🇳🇱',
      slug: 'nl',
      description: 'From the legendary clubs of Amsterdam to intimate jazz bars in Utrecht, the Netherlands boasts one of Europe\'s most vibrant live music scenes. Discover everything from world-class electronic venues to cozy brown cafés hosting acoustic sessions, all within this compact nation that has shaped global music culture for decades.',
      capital: 'Amsterdam',
      population: 17500000,
      language: 'Dutch',
      currency: 'EUR',
      timezone: 'CET'
    }
    // Add more countries here as you expand
  ]);

  private cities = signal<City[]>([
    {
      slug: 'amsterdam',
      name: 'Amsterdam',
      countryCode: 'nl',
      emoji: '🏙️',
      venueCount: 89
    },
    {
      slug: 'utrecht',
      name: 'Utrecht',
      countryCode: 'nl',
      emoji: '🌿',
      venueCount: 34
    },
    {
      slug: 'amersfoort',
      name: 'Amersfoort',
      countryCode: 'nl',
      emoji: '⭐',
      venueCount: 12
    },
    {
      slug: 'rotterdam',
      name: 'Rotterdam',
      countryCode: 'nl',
      emoji: '🚢',
      venueCount: 23
    },
    {
      slug: 'the-hague',
      name: 'The Hague',
      countryCode: 'nl',
      emoji: '🏛️',
      venueCount: 18
    },
      // { slug: 'groningen', name: 'Groningen', countryCode: 'nl', emoji: '🌟', venueCount: 15 },
      // { slug: 'eindhoven', name: 'Eindhoven', countryCode: 'nl', emoji: '💡', venueCount: 28 },
      // { slug: 'tilburg', name: 'Tilburg', countryCode: 'nl', emoji: '🎭', venueCount: 19 },
      // { slug: 'breda', name: 'Breda', countryCode: 'nl', emoji: '🏰', venueCount: 22 },
      // { slug: 'nijmegen', name: 'Nijmegen', countryCode: 'nl', emoji: '📚', venueCount: 16 },
      // { slug: 'haarlem', name: 'Haarlem', countryCode: 'nl', emoji: '🌷', venueCount: 13 }
  ]);

  // Reactive to router changes
  readonly $currentCountryCode = this.routerState.$countryCode;
  readonly $currentCitySlug = this.routerState.$citySlug;

  // Computed signals for current location
  readonly $currentCountry = computed(() => {
    const countryCode = this.$currentCountryCode();
    if (!countryCode) return null;
    return this.countries().find(country => country.code === countryCode) || null;
  });

  readonly $currentCity = computed(() => {
    const citySlug = this.$currentCitySlug();
    const countryCode = this.$currentCountryCode();
    if (!citySlug || !countryCode) return null;

    return this.cities().find(city =>
      city.slug === citySlug && city.countryCode === countryCode
    ) || null;
  });

  // Computed signals for lists
  readonly $allCountries = computed(() => this.countries());

  readonly $allCities = computed(() => this.cities());

  readonly $citiesInCurrentCountry = computed(() => {
    const countryCode = this.$currentCountryCode();
    if (!countryCode) return [];

    return this.cities().filter(city => city.countryCode === countryCode);
  });

  readonly $citiesInCountry = (countryCode: string) => computed(() =>
    this.cities().filter(city => city.countryCode === countryCode)
  );

  // Computed signals for display data
  readonly $currentCountryName = computed(() => this.$currentCountry()?.name || '');
  readonly $currentCountryEmoji = computed(() => this.$currentCountry()?.emoji || '🌍');
  readonly $currentCityName = computed(() => this.$currentCity()?.name || '');
  readonly $currentCityEmoji = computed(() => this.$currentCity()?.emoji || '🏙️');

  // Breadcrumb data
  readonly $breadcrumbs = computed(() => {
    const country = this.$currentCountry();
    const city = this.$currentCity();
    const breadcrumbs: Array<{label: string, route: string[]}> = [
      { label: 'Home', route: ['/'] }
    ];

    if (country) {
      breadcrumbs.push({
        label: country.name,
        route: [country.code]
      });
    }

    if (city) {
      breadcrumbs.push({
        label: city.name,
        route: [country!.code, city.slug]
      });
    }

    return breadcrumbs;
  });

  // Helper methods for finding locations
  getCountryByCode(code: string): Country | undefined {
    return this.countries().find(country => country.code === code);
  }

  getCityBySlug(slug: string, countryCode?: string): City | undefined {
    return this.cities().find(city =>
      city.slug === slug &&
      (countryCode ? city.countryCode === countryCode : true)
    );
  }

  // Future: Replace these with API calls
  // loadCountries(): Observable<Country[]> { ... }
  // loadCitiesForCountry(countryCode: string): Observable<City[]> { ... }
}
