import { Routes } from '@angular/router';
import {VenueDetails} from "@components/venue-details/venue-details";
import {venueDetailResolver} from "@core/resolvers/venue-detail.resolver";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: ':venueId',
        component: VenueDetails,
        resolve: {
            venue: venueDetailResolver
        }
    }
];
