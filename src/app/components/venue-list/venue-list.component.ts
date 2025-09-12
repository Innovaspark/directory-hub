import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  PLATFORM_ID,
  computed,
  effect
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { VenueStateService } from "@core/services/venue-state.service";
import {ViewModeButtons} from "@components/view-mode-buttons/view-mode-buttons";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {VenuesMapComponent} from "@components/venues-map/venues-map";
import {VenueCardComponent} from "@components/venue-card/venue-card";

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [CommonModule, ViewModeButtons, InfiniteScrollDirective, VenuesMapComponent, VenueCardComponent],
  template: `
      <section>
          <div class="container mx-auto px-4">

              <app-view-mode-buttons></app-view-mode-buttons>

              <div [class]="$viewMode() === 'split' ? 'split-layout' : 'full-layout'">
                  <div class="venues-grid"
                       infiniteScroll
                       [scrollWindow]="true"
                       (scrolled)="onScrollDown()">

                      @for (venue of $venues(); track venue.id; let i = $index) {
                      <app-venue-card [venue]="venue" #venueCard></app-venue-card>
                      }

                  </div>

                  @if ($viewMode() === 'split') {
                  <div class="sidebar">
                      @defer {
                  <app-venues-map></app-venues-map>
                  } @placeholder {
                  <div class="map-placeholder">Loading map...</div>
                  }
                  </div>
                  }

              </div>

              <!-- Trigger element for intersection observer -->
              <div #loadTrigger class="load-trigger h-4"></div>

              <!-- End of results indicator -->
              @if (!$showLoadingSpinner() && $venues().length >= $totalVenueCount() && $venues().length > 0) {
              <div class="text-center py-8">
                <p class="text-gray-500">You've reached the end of the results</p>
                <p class="text-sm text-gray-400">Showing {{$venues().length}} of {{$totalVenueCount()}} venues</p>
                </div>
              }

              <!-- No results message -->
              @if (!$isLoading() && $venues().length === 0) {
              <div class="text-center py-12">
                <p class="text-gray-500 text-lg">No venues found</p>
                <p class="text-gray-400">Try adjusting your search or filters</p>
              </div>
              }
          </div>

      </section>

      <!-- Keep spinner OUTSIDE section so it's not affected by parent scroll -->
      @if ($showLoadingSpinner()) {
      <div class="fixed inset-0 flex justify-center items-end z-[9999] bg-black/20 pointer-events-none">
      <div class="flex flex-col items-center mb-20 pointer-events-auto" style="background-color: rgba(255,255,255,0.85); padding: 1rem 1.5rem; border-radius: 0.5rem;">
      <!-- Spinner -->
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
      <!-- Custom green text -->
      <span style="color: #10b981; font-weight: 600; font-size: 1.125rem;">Loading more venues...</span>
      </div>
      </div>
      }

  `, styles: [`
        .full-layout {
            display: block;
        }

        .split-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }

        .sidebar {
            position: sticky;
            top: 20px;
            height: 100vh;
        }

        .map-placeholder {
            background: #f5f5f5;
            border: 2px dashed #ddd;
            border-radius: 8px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 1.2rem;
        }
  `]
})
export class VenueListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loadTrigger') loadTrigger!: ElementRef;
  @ViewChildren('venueCard', { read: ElementRef }) venueCards!: QueryList<ElementRef>;

  private venueState = inject(VenueStateService);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  $viewMode = this.venueState.$viewMode;
  isBrowser = isPlatformBrowser(this.platformId);
  cardViewIcon = 'th-large';
  splitViewIcon = 'map';

  // Get data from venue state service - all loading states managed there now
  $selectedVenue = this.venueState.$selectedVenue;
  $venues = this.venueState.$filteredVenues;
  $isLoading = this.venueState.$isLoading;
  $isLoadingMore = this.venueState.$isLoadingMore;
  $totalVenueCount = this.venueState.$totalVenueCount;
  $venueTypes = computed(() => this.venueState.$filterOptions());

  // Simplified loading spinner logic - all managed by service
  $showLoadingSpinner = computed(() => {
    const apiLoading = this.$isLoading();
    const moreLoading = this.$isLoadingMore();
    const hasVenues = this.$venues().length > 0;

    return (apiLoading || moreLoading) && hasVenues;
  });

  constructor() {
    // Auto-scroll to selected venue
    effect(() => {
      const selectedVenue = this.$selectedVenue();
      if (selectedVenue) {
        setTimeout(() => {
          this.scrollToSelectedVenue(selectedVenue.id);
        }, 100);
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setViewMode(mode: 'cards' | 'split') {
    this.venueState.setViewMode(mode);
  }

  onScrollDown() {
    this.venueState.loadMoreVenues();
  }

  scrollToSelectedVenue(venueId: string) {
    const venues = this.$venues();
    const selectedIndex = venues.findIndex(v => v.id === venueId);

    if (selectedIndex >= 0 && this.venueCards) {
      const cardElement = this.venueCards.toArray()[selectedIndex];
      if (cardElement) {
        cardElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }
}
