// city.routes.ts
import {Routes} from "@angular/router";
import {CityLandingComponent} from "@pages/city/city-landing";
import {CityAboutComponent} from "@pages/city/city-about";
import {CountryLandingPageComponent} from "@pages/country/country";

export const routes: Routes = [
  {
    path: '',
    component: CountryLandingPageComponent
  }
];
