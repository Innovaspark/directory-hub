import { Routes } from '@angular/router';
import VenueDetails from "@components/venue-details/venue-details";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: '/:venueId',
        component: VenueDetails
    }
    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    // }
];
