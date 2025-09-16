// country.guard.ts
import { inject } from '@angular/core';
import { Route, UrlSegment } from '@angular/router';
import { LocationStateService } from '@core/state/location-state.service';
import { map } from 'rxjs';

export const countryGuard = (route: Route, segments: UrlSegment[]) => {
  const locationService = inject(LocationStateService);

  const country = segments[0]?.path;

  // Check if country exists in our location service
  const countryExists = locationService.getCountryByCode(country);

  return !!countryExists; // Convert to boolean
};
