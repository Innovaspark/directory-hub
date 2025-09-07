import {Component, DestroyRef, inject, OnInit, signal, Signal} from '@angular/core';
import {shareReplay} from "rxjs";
import {CommonModule} from "@angular/common";
import {VenueListComponent} from "@components/venue-list/venue-list.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CityService} from "@core/services/city.service";
import {TenantService} from "@core/services/tenant.service";
import {CityTitleBar} from "@components/city-title-bar/city-title-bar";
import {ScrollToTop} from "@components/scroll-to-top/scroll-to-top";
import {VenuesDumpComponent} from "@components/venues-dump/venues-dump";
import {FilterOption, VenueStateService} from "@core/services/venue-state.service";
import {VenueFiltersComponent} from "@components/venue-filters/venue-filters";
import {VenueService} from "@core/services/venue.service";

@Component({
  selector: 'app-venue-hub',
  imports: [CommonModule, VenueListComponent, CityTitleBar, VenueFiltersComponent, ScrollToTop, VenuesDumpComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;

  venuesService = inject(VenueService);
  venueStateService = inject(VenueStateService);

  venuesResponse$ = this.venuesService.getVenues().pipe(
    shareReplay(1)
  );

  // Create signals from the shared observable
  // $venues = toSignal(
  //   this.venuesResponse$.pipe(map(response => response.venues)),
  //   { initialValue: [] as Venue[] }
  // );
  $venues = this.venueStateService.venues;

  // constructor() {}

  ngOnInit() {
    this.loadVenues();
    // TODO: Move to venue state service
    this.cityName = 'Chicago';
    this.cityEmoji = '🏙️';
    this.venueCount = 145;
    this.filterOptions = [
      { slug: 'music_venue', label: 'Music Venues', icon: '🎵' },
      { slug: 'theater', label: 'Theaters', icon: '🎭' },
      { slug: 'jazz_club', label: 'Jazz Clubs', icon: '🎷' }
    ];
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

  private destroyRef = inject(DestroyRef);

  // UI state variables
  cityName: string = '';
  cityEmoji: string = '🏙️';
  venueCount: number = 0;
  selectedFilter: string | null = null;
  searchQuery: string = '';
  filterOptions: FilterOption[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private venueService: VenueService,
    private tenantService: TenantService
  ) {}

  // Event handlers - placeholders for next step
  onSearchChange(query: string): void {
    // TODO: Handle in venue state service
  }

  onSearchSubmit(query: string): void {
    // TODO: Handle in venue state service
  }

  onFilterChange(filter: string | null): void {
    // TODO: Handle in venue state service
  }

}
