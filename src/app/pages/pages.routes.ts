import { Routes } from '@angular/router';
import { guestGuard } from '@core/guards/guest.guard';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import {DirectoryLayoutComponent} from "@layouts/directory-layout/directory-layout.component";
import {DirectoryLayout2Component} from "@layouts/directory-layout2/directory-layout2.component";
import {ClaudeHomeLayout} from "@layouts/claude-home-layout/claude-home-layout";
import {cityGuard} from "@core/guards/city.guard";
import {InvalidCity} from "@pages/city/invalid-city";
import {CountryLandingPageComponent} from "@pages/country/country";
import {countryGuard} from "@core/guards/country.guard";


export const routes: Routes = [
    {
        path: '',
        component: DirectoryLayoutComponent,
        children: [
            { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canMatch: [guestGuard],
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    },
    {
        path: 'venues2',
        component: DirectoryLayout2Component,
        canMatch: [],
        loadChildren: () => import('./venue-hub/venue-hub.routes').then(m => m.routes)
    },
    {
        path: 'venues3',
        component: ClaudeHomeLayout,
        canMatch: [],
        loadChildren: () => import('./venue-hub/venue-hub.routes').then(m => m.routes)
    },
    // {
    //     path: 'venues',
    //     component: DirectoryLayoutComponent,
    //     loadChildren: () => import('./venue-hub/venue-hub.routes').then(m => m.routes),
    //     data: { title: 'All Venues' }
    // },
    {
        path: ':country',
        canMatch: [countryGuard],
        component: CountryLandingPageComponent,
        data: { title: 'Country' }
    },
    {
        path: ':country/:city',
        canMatch: [cityGuard],
        component: DirectoryLayoutComponent,
        loadChildren: () => import('./city/city.routes').then(m => m.routes),
        data: { title: 'City' }
    },
    {
        path: ':country/:city',
        component: InvalidCity // Catches invalid cities
    },
    {
        path: '**',
        loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
