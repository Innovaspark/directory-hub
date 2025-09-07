import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VenueType } from '../models/venue-type.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private venueTypes: VenueType[] = [];

// tenant.service.ts
  constructor() {
    this.venueTypes = [
      { slug: 'music_venue', label: 'Music Venues', icon: '🎵' },
      { slug: 'theater', label: 'Theaters', icon: '🎭' },
      { slug: 'jazz_club', label: 'Jazz Clubs', icon: '🎷' },
      { slug: 'club', label: 'Nightclubs', icon: '🕺' },
      { slug: 'bar', label: 'Bars', icon: '🍻' },
      { slug: 'food', label: 'Food', icon: '🍔' },
    ];
  }

  getVenueTypes(): Observable<VenueType[]> {
    // Replace with actual API call to get tenant-specific venue types
    return of(this.venueTypes);
  }

  setVenueTypes(venueTypes: VenueType[]): void {
    this.venueTypes = venueTypes;
  }

  // Method to load venue types from API
  loadVenueTypesFromApi(): Observable<VenueType[]> {
    // Replace with actual HTTP call
    // return this.http.get<VenueType[]>('/api/tenant/venue-types');
    return of([]);
  }
}
