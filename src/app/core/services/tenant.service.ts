import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VenueType } from '../models/venue-type.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private venueTypes: VenueType[] = [];

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
