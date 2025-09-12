import {Component, computed, Inject, inject, PLATFORM_ID} from "@angular/core";
import {CommonModule, isPlatformBrowser} from "@angular/common";
import {Venue} from "@core/models/venue.model";
import {VenueStateService} from "@core/services/venue-state.service";
import {HoursComponent} from "@components/hours/hours";
import {QuickActionsComponent} from "@components/quick-actions/quick-actions";
import {SingleVenueMapComponent} from "@components/venue-map/venue-map";
import {BreadcrumbComponent} from "@components/breadcrumb/breadcrumb";

@Component({
  selector: 'app-venue-details',
  standalone: true,
  imports: [CommonModule, HoursComponent, QuickActionsComponent, SingleVenueMapComponent, BreadcrumbComponent],
  template: `

      <!-- Add this at the top of your main content, before the grid -->
<!--      <div class="mb-6">-->
<!--          <button class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">-->
<!--              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>-->
<!--              </svg>-->
<!--              Back to venues-->
<!--          </button>-->
<!--      </div>-->

      <div class="min-h-screen bg-gray-50">
          <!-- Header -->
<!--          <div class="bg-white border-b border-gray-100">-->
<!--              <div class="max-w-7xl mx-auto px-4 py-3">-->
<!--                  <div class="flex items-center justify-between">-->
<!--                      <button class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">-->
<!--                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>-->
<!--                          </svg>-->
<!--                          Back to venues-->
<!--                      </button>-->
<!--                      <div class="text-sm text-gray-500">-->
<!--        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">-->
<!--          {{ venueState.$currentVenue()?.primary_type }}-->
<!--        </span>-->
<!--                      </div>-->
<!--                  </div>-->
<!--              </div>-->
<!--          </div>-->


          
          <app-breadcrumb></app-breadcrumb>

          <div class="max-w-7xl mx-auto px-4 py-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  <!-- Left Column - Venue Details -->
                  <div class="space-y-6">

                      <!-- Hero Image & Title -->
                      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                          @if (venueState.$currentVenue()?.photo) {
                          <img
                                  [src]="venueState.$currentVenue()?.photo"
                                  [alt]="venueState.$currentVenue()?.name || 'Venue'"
                                  class="w-full h-64 object-cover"
                          />
                          } @else {
                          <div class="w-full h-64 bg-gray-200 flex items-center justify-center">
                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          }
                          <div class="p-6">
                              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ venueState.$currentVenue()?.name }}</h1>
                              <div class="flex items-center gap-4 mb-4">
                                  <div class="flex items-center">
                                      <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                      </svg>
                                      <span class="font-semibold">{{ venueState.$currentVenue()?.rating }}</span>
                                      <span class="text-gray-600 ml-1">({{ venueState.$currentVenue()?.review_count }}
                                          reviews)</span>
                                  </div>
                              </div>
                              <p class="text-gray-700 leading-relaxed">
                                  {{ venueState.$currentVenue()?.review_summary }}
                              </p>
                          </div>
                      </div>

                      <!-- Contact & Location -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Contact & Location</h2>
                          <div class="space-y-3">
                              <div class="flex items-start gap-3">
                                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor"
                                       viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                  </svg>
                                  <div>
                                      <p class="text-gray-900">{{ venueState.$currentVenue()?.full_address }}</p>
                                      <button class="text-blue-600 text-sm hover:underline" (click)="onGetDirections()">
                                          Get directions
                                      </button>
                                  </div>
                              </div>

                              <div class="flex items-center gap-3">
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                       viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                  </svg>
                                  <a [href]="'tel:' + venueState.$currentVenue()?.phone"
                                     class="text-blue-600 hover:underline">{{ venueState.$currentVenue()?.phone }}</a>
                              </div>

                              <div class="flex items-center gap-3">
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                       viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                                  </svg>
                                  <a [href]="venueState.$currentVenue()?.site" target="_blank" rel="noopener noreferrer"
                                     class="text-blue-600 hover:underline">
                                      Visit website
                                  </a>
                              </div>
                          </div>
                      </div>
                      <!-- Hours -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Hours</h2>
                          <app-hours [hours]="$currentVenue()?.working_hours ?? ''"></app-hours>
                      </div>
                  </div>

                  <!-- Right Column - Map & Interactive Elements -->
                  <div class="space-y-6">

                      <!-- Map Component -->
                      <div class="bg-white rounded-xl shadow-lg" [style.height]="'600px'">
<!--                          <div class="h-80 bg-gray-200 flex items-center justify-center">-->
<!--                              <div class="text-center">-->
<!--                                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor"-->
<!--                                       viewBox="0 0 24 24">-->
<!--                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"-->
<!--                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>-->
<!--                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"-->
<!--                                            d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"/>-->
<!--                                  </svg>-->
<!--                                  <p class="text-gray-500">Map showing venue location</p>-->
<!--                                  <p class="text-sm text-gray-400">{{ venueState.$currentVenue()?.full_address }}</p>-->
<!--                              </div>-->
<!--                          </div>-->
                          <app-single-venue-map [venue]="$currentVenue()"></app-single-venue-map>
                      </div>

                      <!-- Quick Actions -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <app-quick-actions [venue]="$currentVenue()"></app-quick-actions>
                      </div>
                  </div>
              </div>
          </div>
      </div>

  `
})
export class VenueDetails {

  venueState = inject(VenueStateService);
  $currentVenue = this.venueState.$currentVenue;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  ngOnInit() {
    // Force scroll to top when component loads
    this.scrollToTop();
  }

  onGetDirections() {
    const venue = this.venueState.$currentVenue();
    if (venue) {
      this.getDirections(venue);
    } else {
      alert('no venue!');
    }
  }

  getDirections(venue: Venue) {
    if (!venue.full_address) return;

    const address = encodeURIComponent(venue.full_address);
    // Try native apps on mobile, fallback to web
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `maps://maps.apple.com/?daddr=${address}`;
    } else if (/Android/i.test(navigator.userAgent)) {
      window.location.href = `google.navigation:q=${address}`;
    } else {
      window.open(`https://maps.google.com/maps?daddr=${address}`, '_blank');
    }
  }


}
