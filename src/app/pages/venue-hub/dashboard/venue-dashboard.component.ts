import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { VenueListComponent } from "@components/venue-list/venue-list.component";
import { ScrollToTop } from "@components/scroll-to-top/scroll-to-top";
import { SearchBarComponent } from "@components/search-bar/search-bar";
import {VenueFiltersComponent} from "@components/venue-filters/venue-filters";
import {ViewModeButtons} from '@components/view-mode-buttons/view-mode-buttons';
import {FloatingToolbarComponent} from '@components/floating-toolbar';
import {InViewDirective} from '@core/directives/in-view.directive';

@Component({
  selector: 'app-venue-hub',
  standalone: true,
  imports: [
    CommonModule,
    VenueListComponent,
    SearchBarComponent,
    VenueFiltersComponent,
    FloatingToolbarComponent,
    ViewModeButtons,
    InViewDirective
  ],
  template: `
    <app-search-bar appInView (inViewChanged)="isSearchBarVisible = $event"></app-search-bar>

    <div class="floating-toolbar" [class.toolbar-up]="!isSearchBarVisible">
      <app-view-mode-buttons></app-view-mode-buttons>
    </div>


    <div class="mt-5">
      <div>
        <app-venue-filters></app-venue-filters>
      </div>
      <app-venue-list></app-venue-list>
    </div>

  `
})
export class VenueDashboardComponent {
  // Pure layout container - no logic needed
  isSearchBarVisible = true;
}
