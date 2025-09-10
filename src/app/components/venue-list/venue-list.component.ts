import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
  PLATFORM_ID,
  computed
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { VenueStateService } from "@core/services/venue-state.service";
import {ViewModeButtons} from "@components/view-mode-buttons/view-mode-buttons";

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [CommonModule, ViewModeButtons],
  template: `
      <section>
          <div class="container mx-auto px-4">

              <app-view-mode-buttons></app-view-mode-buttons>


              <div class="venues-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                  @for (venue of $venues(); track venue.id; let i = $index) {
                  <div class="venue-card" [style.--item-index]="i">
                    <div class="relative">
                      <img class="w-full h-48 object-cover"
                           [src]="venue.photo || defaultVenueImage"
                           (error)="onImageError($event)"
                           [alt]="venue.name">
                      <div [ngClass]="['button-venue-type', \`button-venue-type-\${venue.primary_type}\`]">
                  {{venue.primary_type}}
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-heading text-xl font-bold text-gray-900 mb-2">{{venue.name}}</h3>
                      <p class="text-gray-600 mb-4">{{venue.review_summary}}</p>
                      <div class="flex items-center mb-4">
                        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewbox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span class="text-gray-700 text-sm">{{venue.rating}} ({{venue.review_count}} reviews)</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-purple-600 font-medium">Wed: Open Mic</span>
                        <button class="text-purple-600 hover:text-purple-800 font-medium">View Details</button>
                      </div>
                    </div>
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
  `
})
export class VenueListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loadTrigger') loadTrigger!: ElementRef;

  private venueState = inject(VenueStateService);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  viewMode: 'cards' | 'split' = 'cards';
  cardViewIcon = 'th-large';
  splitViewIcon = 'columns';


  // Get data from venue state service - all loading states managed there now
  $venues = this.venueState.$filteredVenues;
  $isLoading = this.venueState.$isLoading;
  $isLoadingMore = this.venueState.$isLoadingMore;
  $totalVenueCount = this.venueState.$totalVenueCount;
  $venueTypes = computed(() => this.venueState.$filterOptions());

  defaultVenueImage =
    'https://images.unsplash.com/photo-1543261876-1a37d08f7b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMzIzMzB8MHwxfHNlYXJjaHwxfHx8MTc1NjkxODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&w=450';

  // Simplified loading spinner logic - all managed by service
  $showLoadingSpinner = computed(() => {
    const apiLoading = this.$isLoading();
    const moreLoading = this.$isLoadingMore();
    const hasVenues = this.$venues().length > 0;

    // Only show spinner in browser
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return (apiLoading || moreLoading) && hasVenues;
  });

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    if (isPlatformBrowser(this.platformId)) {
      // Scroll to top on page refresh or first load
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // All loading and pagination logic now handled in the service
          this.venueState.loadMoreVenues();
        }
      });
    }, options);

    if (this.loadTrigger) {
      this.observer.observe(this.loadTrigger.nativeElement);
    }
  }

  onImageError(event: any) {
    event.target.src = this.defaultVenueImage;
  }


  setViewMode(mode: 'cards' | 'split') {
    this.viewMode = mode;
  }
}
