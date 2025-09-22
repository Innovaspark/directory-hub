// city.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { CityService } from '@services/city.service';
import { map } from 'rxjs';


export const cityGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const cityService = inject(CityService);
  const router = inject(Router);

  const country = segments[0]?.path;
  const city = segments[1]?.path;

  if (city === 'all') {
    return true; // Always allow "all"
  }

  return cityService.validateCountryCity(country!, city!).pipe(
    map(isValid => {
      if (!isValid) {
        return router.createUrlTree([`/${country}/invalid`]);
      }
      return true;
    })
  );
};
