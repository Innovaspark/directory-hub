import { Routes } from '@angular/router';
import {VenueDetails} from "@components/venue-details/venue-details";
import {venueDetailResolver} from "@core/resolvers/venue-detail.resolver";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/venue-dashboard.component').then(m => m.VenueDashboardComponent)
    },
    {
        path: ':venueId',
        component: VenueDetails,
        resolve: {
            venue: venueDetailResolver
        }
    }
];
