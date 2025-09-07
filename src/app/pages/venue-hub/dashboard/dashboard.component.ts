import {Component, inject, OnInit, signal, Signal} from '@angular/core';
import {map, shareReplay} from "rxjs";
import {VenuesResponse, VenueService} from "@services/venue.service";
import {CommonModule} from "@angular/common";
import {VenueListComponent} from "@components/venue-list/venue-list.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {Venue} from "@core/models/venue.model";

@Component({
  selector: 'app-venue-hub',
  imports: [CommonModule, VenueListComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;

  venuesService = inject(VenueService);

  venuesResponse$ = this.venuesService.getVenues().pipe(
    shareReplay(1)
  );

  // Create signals from the shared observable
  $venues = toSignal(
    this.venuesResponse$.pipe(map(response => response.venues)),
    { initialValue: [] as Venue[] }
  );

  constructor() {}

  ngOnInit() {
    this.loadVenues();
  }

  loadVenues() {
    this.loading = true;
    this.error = null;

    // this.venues$ = this.venuesService.getVenues(20, 0);
    //
    // // For debugging - log to console
    // this.venues$.subscribe({
    //   next: (data) => {
    //     console.log('Venues data:', data);
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error loading venues:', err);
    //     this.error = err.message || 'Failed to load venues';
    //     this.loading = false;
    //   }
    // });
  }
}
