import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';
import { guestGuard } from '@core/guards/guest.guard';
import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import {DirectoryLayoutComponent} from "@layouts/directory-layout/directory-layout.component";
import {DirectoryLayout2Component} from "@layouts/directory-layout2/directory-layout2.component";
import {ClaudeHomeLayout} from "@layouts/claude-home-layout/claude-home-layout";


export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
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
        path: 'admin',
        component: AdminLayoutComponent,
        canMatch: [adminGuard],
        loadChildren: () => import('./admin/admin.routes').then(m => m.routes)
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
    {
        path: 'venues',
        component: DirectoryLayoutComponent,
        loadChildren: () => import('./venue-hub/venue-hub.routes').then(m => m.routes),
        data: { title: 'All Venues' }
    },
    {
        path: 'venues/:city',
        component: DirectoryLayoutComponent,
        loadChildren: () => import('./venue-hub/venue-hub.routes').then(m => m.routes),
        data: { title: 'Venues' }
    },
    {
        path: 'venue/:city/:venueId',
        loadChildren: () => import('./venue-hub/venue-hub.routes').then(m => m.routes)
    },
    {
        path: '**',
        loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
