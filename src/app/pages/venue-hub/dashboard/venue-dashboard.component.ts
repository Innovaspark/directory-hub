import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { VenueListComponent } from "@components/venue-list/venue-list.component";
import { ScrollToTop } from "@components/scroll-to-top/scroll-to-top";
import { SearchBarComponent } from "@components/search-bar/search-bar";
import {VenueFiltersComponent} from "@components/venue-filters/venue-filters";

@Component({
  selector: 'app-venue-hub',
  standalone: true,
  imports: [
    CommonModule,
    VenueListComponent,
    SearchBarComponent,
    VenueFiltersComponent
  ],
  template: `
    <app-search-bar></app-search-bar>

    <div class="mt-5">
        <app-venue-filters></app-venue-filters>
      <app-venue-list></app-venue-list>
    </div>

  `
})
export class VenueDashboardComponent {
  // Pure layout container - no logic needed
}
