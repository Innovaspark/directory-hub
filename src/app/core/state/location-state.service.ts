import { Injectable, signal, computed, inject } from '@angular/core';
import { RouterStateService } from './router-state.service';
import { CityService } from '../services/city.service';
import { City } from '@core/models/city.model';
import { Country } from '@core/models/country.model';

@Injectable({
  providedIn: 'root'
})
export class LocationStateService {
  private routerState = inject(RouterStateService);
  private cityService = inject(CityService);

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
  ]);

  private cities = signal<City[]>([]);

  readonly $currentCountryCode = this.routerState.$countryCode;
  readonly $allCountries = computed(() => this.countries());

  readonly $currentCountry = computed(() => {
    const countryCode = this.$currentCountryCode();
    if (!countryCode) return null;
    return this.countries().find(country => country.code === countryCode) || null;
  });

  readonly $citiesInCurrentCountry = computed(() => {
    const countryCode = this.$currentCountryCode();
    if (!countryCode) return [];

    return this.cities().filter(city => city.country?.code === countryCode);
  });

  readonly $citiesInCountry = (countryCode: string) => computed(() =>
    this.cities().filter(city => city.country?.code === countryCode)
  );

  constructor() {
    this.loadCities();
  }

  private loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (response) => {
        this.cities.set(response.cities);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countries().find(country => country.code === code);
  }


}
