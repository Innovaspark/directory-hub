import { Routes } from '@angular/router';
import {DirectoryLayoutComponent} from "@layouts/directory-layout/directory-layout.component";
import {HomeComponent} from "@pages/home/home.component";
import {countryGuard} from "@core/guards/country.guard";
import {cityGuard} from "@core/guards/city.guard";
import {CityLandingComponent} from "@pages/city/city-landing";
import {CountryLandingPageComponent} from "@pages/country/country";
import {venueDetailResolver} from "@core/resolvers/venue-detail.resolver";
import {CityAboutComponent} from "@pages/city/city-about";
import {NotFoundComponent} from "@pages/not-found/not-found.component";
import {VenueListComponent} from "@components/venue-list/venue-list.component";
import {VenueDetails} from "@components/venue-details/venue-details";
import {VenueDashboardComponent} from "@pages/venue-hub/dashboard/venue-dashboard.component";

// export const routes: Routes = [
//     {
//         path: '',
//         loadChildren: () => import('./pages/pages.routes').then(m => m.routes)
//     }
// ];

// app.routes.ts - Ultra simple
export const routes: Routes = [
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
                data: { prerender: false }
            },
            {
                path: ':country/:city',
                canMatch: [cityGuard],
                component: CityLandingComponent,
                data: { prerender: false }
            },
            {
                path: ':country/:city/venues',
                canMatch: [cityGuard],
                component: VenueDashboardComponent,
                data: { prerender: false }
            },
            {
                path: ':country/:city/venues/:venueId',
                component: VenueDetails,
                resolve: {
                    venue: venueDetailResolver
                },
                data: { prerender: false }
            },
            {
                path: ':country/:city/about',
                canMatch: [cityGuard],
                component: CityAboutComponent,
                data: { prerender: false }
            },
            {
                path: '**',
                component: NotFoundComponent,
                data: { prerender: false }
            }
        ]
    }
];

// That's it. Delete everything else:
// - pages.routes.ts
// - city.routes.ts
// - venue-hub.routes.ts
// - country.routes.ts
// - auth folder (for now)

/*
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'nl', component: CountryLandingComponent },
  { path: ':country', component: CountryLandingComponent, data: { prerender: false } },
  { path: ':country/:city', component: CityLandingComponent, data: { prerender: false } },
  { path: ':country/:city/venues/:venueId', component: VenueDetailComponent, data: { prerender: false } },
  { path: ':country/:city/about', component: AboutCityComponent, data: { prerender: false } },
  { path: '**', component: NotFoundComponent, data: { prerender: false } },
];
 */
