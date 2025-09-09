// city.routes.ts
import {Routes} from "@angular/router";
import {CityLandingComponent} from "@pages/city/city-landing";
import {CityAboutComponent} from "@pages/city/city-about";
import {InvalidCity} from "@pages/city/invalid-city";
import {cityGuard} from "@core/guards/city.guard";

export const routes: Routes = [
  {
    path: '',
    canMatch: [cityGuard],
    component: CityLandingComponent
  },
  {
    path: 'venues',
    loadChildren: () => import('../venue-hub/venue-hub.routes').then(m => m.routes)
  },
  {
    path: 'venues/:venueId',
    loadChildren: () => import('../venue-hub/venue-hub.routes').then(m => m.routes)
  },
  {
    path: 'about',
    component: CityAboutComponent
  },
  // {
  //   path: '**',
  //   component: InvalidCity // Catches any unmatched paths under valid cities
  // }
];
