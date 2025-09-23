import {Component, inject, input, computed} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Venue} from "@core/models/venue.model";
import {VenueStateService} from "@core/state/venue-state.service";
import {NavigationService} from "@core/services/navigation.service";
import {MobileDetectionService} from '@services/mobile-detection.service';

@Component({
  selector: 'app-venue-card',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div [class]="isMobile ? 'venue-card-mobile' : 'venue-card'"
           [ngClass]="{'venue-card-selected': isSelectedVenue()}"
           (click)="onVenueClick(venue())">
          <div class="relative">
              <img class="w-full h-48 object-cover"
                   [src]="venue().photo || defaultVenueImage"
                   (error)="onImageError($event)"
                   [alt]="venue().name">
              <div [ngClass]="['button-venue-type', 'button-venue-type-' + venue().primary_type]">
                  {{venue().primary_type}}
              </div>
          </div>
          <div class="p-6">
              <h3 class="font-heading text-xl font-bold text-gray-900 mb-2">{{venue().name}}</h3>
              <p class="text-gray-600 mb-4 venue-description">{{venue().description}}</p>
              <div class="flex items-center mb-4">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewbox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-gray-700 text-sm">{{venue().rating}} ({{venue().review_count}} reviews)</span>
              </div>
              <div class="flex justify-between items-center">
<!--                  <span class="text-purple-600 font-medium">Wed: Open Mic</span>-->
<!--                  <button class="text-purple-600 hover:text-purple-800 font-medium"-->
<!--                          (click)="viewDetailsQuick($event)"-->
<!--                  >View Details</button>-->
<!--                  <span class="text-purple-600 font-medium">{{venue().business_status}}</span>-->
              </div>
          </div>

          <div *ngIf="isSelectedVenue()"
               class="floating-venue-popover">
              <div class="popover-content">
                  <div class="venue-info">
                      <img [src]="$selectedVenue()?.photo || defaultVenueImage"
                           [alt]="$selectedVenue()?.name"
                           class="venue-thumb">
                      <div class="venue-details">
                          <h4>{{ $selectedVenue()?.name }}</h4>
                          <p>{{ $selectedVenue()?.primary_type }}</p>
                      </div>
                  </div>

                  <div class="popover-actions">
                      <button (click)="viewDetails()"
                              class="btn-primary">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          View Details
                      </button>

                      <button (click)="closePopOver($event)"
                              class="btn-close"
                              aria-label="Close">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                      </button>
                  </div>
              </div>
          </div>

      </div>

  `
})
export class VenueCardComponent {

  defaultVenueImage =
    'https://images.unsplash.com/photo-1543261876-1a37d08f7b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMzIzMzB8MHwxfHNlYXJjaHwxfHx8MTc1NjkxODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&w=450';

  venueState = inject(VenueStateService);
  navigationService = inject(NavigationService);
  mobileDetectionService = inject(MobileDetectionService);
  isMobile = this.mobileDetectionService.isMobile();

  $selectedVenue = this.venueState.$selectedVenue;
  venue = input.required<Venue>();

  // Computed signal to check if this venue is selected
  isSelectedVenue = computed(() => {
    return this.$selectedVenue()?.id === this.venue().id;
  });

  onImageError(event: any) {
    event.target.src = this.defaultVenueImage;
  }

  onVenueClick(venue: Venue) {
    this.venueState.selectVenue(venue);
  }

  viewDetails() {
    // alert('view details');
    const selectedVenue = this.venueState.$selectedVenue();
    if (selectedVenue) {
      this.navigationService.navigateToVenue(this.venueState.$countryCode(), this.venueState.$citySlug(), selectedVenue);
    }
  }

  closePopOver(event: Event) {
    event.stopPropagation();
    this.venueState.clearSelectedVenue();
  }

  viewDetailsQuick(event: Event) {
    this.viewDetails();
    event.stopPropagation();
  }
}
