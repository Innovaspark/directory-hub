import { inject } from '@angular/core';
import {Router, CanActivateFn, ActivatedRoute} from '@angular/router';
import {CityService} from '@services/city.service';

export const cityGuardActivate: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cityService = inject(CityService);
  const activatedRoute = inject(ActivatedRoute);

  const country = route.paramMap.get('country');
  const city = route.paramMap.get('city');

  const specialCities = ['all', 'invalid', 'unavailable'];
  if (specialCities.includes(city!)) return true;


  const isValid = cityService.validateCountryCity(country!, city!);

  if (!isValid) {
    return router.createUrlTree(['../invalid'], { relativeTo: activatedRoute });
  } else {
    return true;
  }

};
