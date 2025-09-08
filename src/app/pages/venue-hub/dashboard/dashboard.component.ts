import {Component, DestroyRef, inject, OnInit, signal, Signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VenueListComponent} from "@components/venue-list/venue-list.component";
import {ScrollToTop} from "@components/scroll-to-top/scroll-to-top";
import {VenuesDumpComponent} from "@components/venues-dump/venues-dump";
import {FilterOption, VenueStateService} from "@core/services/venue-state.service";
import {VenueFiltersComponent} from "@components/venue-filters/venue-filters";

@Component({
  selector: 'app-venue-hub',
  imports: [CommonModule, VenueListComponent, VenueFiltersComponent, ScrollToTop, VenuesDumpComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;

  venueStateService = inject(VenueStateService);

  $venues = this.venueStateService.$venues;

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
  }

  // UI state variables
  cityName: string = '';
  cityEmoji: string = '🏙️';
  venueCount: number = 0;
  filterOptions: FilterOption[] = [];


}
