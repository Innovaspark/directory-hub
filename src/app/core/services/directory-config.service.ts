import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DirectoryConfig } from '../models/directory-config.model';

@Injectable({
  providedIn: 'root'
})
export class DirectoryConfigService {
  private config: DirectoryConfig = {
    name: 'Directory',
    description: 'Find locations',
    venueTypesLabel: 'Types',
    venuesLabel: 'Locations',
    singleVenueLabel: 'Location',
    searchPlaceholder: 'Search...',
    heroTitle: 'Find Locations',
    heroDescription: 'Discover places near you',
    categoriesLabel: 'Categories'
  };

  getConfig(): Observable<DirectoryConfig> {
    return of(this.config);
  }

  setConfig(config: DirectoryConfig): void {
    this.config = config;
  }

  // Method to load config from API
  loadConfigFromApi(): Observable<DirectoryConfig> {
    // Replace with actual HTTP call
    // return this.http.get<DirectoryConfig>('/api/tenant/config');
    return of(this.config);
  }
}
