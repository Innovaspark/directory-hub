import {Component, inject, OnInit, signal, Signal} from '@angular/core';
import {map, Observable, shareReplay} from "rxjs";
import {Venue, VenuesResponse, VenuesService} from "@services/venues.service";
import {CommonModule} from "@angular/common";
import {VenueListComponent} from "@components/venue-list/venue-list.component";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-venue-hub',
  imports: [CommonModule, VenueListComponent],
  templateUrl: './dashboard.component.html',
  styles: [`
    .venues-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .error {
      color: red;
      padding: 10px;
      background: #ffe6e6;
      border: 1px solid red;
      border-radius: 4px;
    }
    
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    
    .venue-item {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .venue-item h4 {
      margin-top: 0;
      color: #333;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;

  venuesService = inject(VenuesService);

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
