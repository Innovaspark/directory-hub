// city.routes.ts
import {Routes} from "@angular/router";
import {CityLandingComponent} from "@pages/city/city-landing";
import {CityAboutComponent} from "@pages/city/city-about";

export const routes: Routes = [
  {
    path: '',
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
  }
];
