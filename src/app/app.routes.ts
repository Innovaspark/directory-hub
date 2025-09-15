import {Routes} from '@angular/router';
import {DirectoryLayoutComponent} from "@layouts/directory-layout/directory-layout.component";
import {HomeComponent} from "@pages/home/home.component";
import {countryGuard} from "@core/guards/country.guard";
import {cityGuard} from "@core/guards/city.guard";
import {CityLandingComponent} from "@pages/city/city-landing";
import {CountryLandingPageComponent} from "@pages/country/country";
import {venueDetailResolver} from "@core/resolvers/venue-detail.resolver";
import {CityAboutComponent} from "@pages/city/city-about";
import {NotFoundComponent} from "@pages/not-found/not-found.component";
import {VenueDetails} from "@components/venue-details/venue-details";
import {VenueDashboardComponent} from "@pages/venue-hub/dashboard/venue-dashboard.component";
import {AdminGuard} from '@core/guards/admin.guard';
import {AdminLayoutComponent} from '@layouts/admin-layout/admin-layout.component';
import {AuthLayoutComponent} from '@layouts/auth-layout/auth-layout.component';


export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    component: DirectoryLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'nl',
        canMatch: [countryGuard],
        component: CountryLandingPageComponent
      },
      {
        path: ':country',
        canMatch: [countryGuard],
        component: CountryLandingPageComponent,
        data: {prerender: false}
      },
      {
        path: ':country/:city',
        canMatch: [cityGuard],
        component: CityLandingComponent,
        data: {prerender: false}
      },
      {
        path: ':country/:city/venues',
        canMatch: [cityGuard],
        component: VenueDashboardComponent,
        data: {prerender: false}
      },
      {
        path: ':country/:city/venues/:venueId',
        component: VenueDetails,
        resolve: {
          venue: venueDetailResolver
        },
        data: {prerender: false}
      },
      {
        path: ':country/:city/about',
        canMatch: [cityGuard],
        component: CityAboutComponent,
        data: {prerender: false}
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: {prerender: false}
      }
    ]
  }
];

