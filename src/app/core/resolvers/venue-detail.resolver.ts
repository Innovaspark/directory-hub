import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Venue} from "@core/models/venue.model";
import {VenueStateService} from "@core/state/venue-state.service";

export const venueDetailResolver: ResolveFn<Venue | null> = (route, state) => {
  const venueStateService = inject(VenueStateService);
  const router = inject(Router);

  const venueId = route.paramMap.get('venueId');

  if (!venueId) {
    // Redirect to venues list if no ID provided
    router.navigate(['/venues']);
    return of(null);
  }

  return venueStateService.loadCurrentVenue(venueId).pipe(
    map(venue => {
      // If venue not found, could redirect or let component handle
      // For now, let component handle the null case
      return venue;
    }),
    catchError(() => {
      // Could redirect to 404 or venues list on error
      // For now, return null and let component handle
      return of(null);
    })
  );
};
