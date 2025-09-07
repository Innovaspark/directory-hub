import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citiesSubject = new BehaviorSubject<City[]>([]);
  public cities$ = this.citiesSubject.asObservable();

  // Hard-coded data for now - replace with HTTP calls later
  private hardcodedCities: City[] = [
    {
      slug: 'chicago',
      name: 'Chicago',
      state: 'Illinois',
      emoji: '🏙️',
      timezone: 'America/Chicago',
      venueCount: 145,
      isActive: true,
      launchDate: '2025-01-15'
    },
    {
      slug: 'amersfoort',
      name: 'Amersfoort',
      state: 'Utrecht',
      emoji: '🏙️',
      timezone: 'America/Chicago',
      venueCount: 145,
      isActive: true,
      launchDate: '2025-01-15'
    }
    // Add more cities here as you expand
  ];

  constructor() {
    this.loadCities();
  }

  private loadCities(): void {
    // Simulate API call - replace with actual HTTP request
    setTimeout(() => {
      this.citiesSubject.next(this.hardcodedCities);
    }, 100);
  }

  getCities(): Observable<City[]> {
    return this.cities$;
  }

  getActiveCities(): Observable<City[]> {
    return this.cities$.pipe(
      map(cities => cities.filter(city => city.isActive))
    );
  }

  getCityBySlug(slug: string): Observable<City | null> {
    return this.cities$.pipe(
      map(cities => cities.find(c => c.slug === slug) || null)
    );
  }

  get isMultiCity(): Observable<boolean> {
    return this.cities$.pipe(
      map(cities => cities.filter(c => c.isActive).length > 1)
    );
  }

  get primaryCity(): Observable<City | null> {
    return this.cities$.pipe(
      map(cities => {
        const activeCities = cities.filter(c => c.isActive);
        return activeCities.length > 0 ? activeCities[0] : null;
      })
    );
  }

  // Method to add cities (for your expansion)
  addCity(city: City): void {
    const currentCities = this.citiesSubject.value;
    this.citiesSubject.next([...currentCities, city]);
  }

  // Method to update cities from API
  setCities(cities: City[]): void {
    this.citiesSubject.next(cities);
  }
}
