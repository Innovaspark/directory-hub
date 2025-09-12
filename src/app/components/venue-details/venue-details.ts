import {Component, Inject, inject, PLATFORM_ID} from "@angular/core";
import {CommonModule, isPlatformBrowser} from "@angular/common";
import {Venue} from "@core/models/venue.model";
import {VenueStateService} from "@core/services/venue-state.service";

@Component({
  selector: 'app-venue-details',
  standalone: true,
  imports: [CommonModule],
  template: `
      
      <div class="min-h-screen bg-gray-50">
          <!-- Header -->
          <div class="bg-white shadow-sm border-b">
              <div class="max-w-7xl mx-auto px-4 py-4">
                  <div class="flex items-center gap-4">
                      <button class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to venues
                      </button>
                      <div class="text-sm text-gray-500">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Jazz Club
                        </span>
                      </div>
                  </div>
              </div>
          </div>

          <div class="max-w-7xl mx-auto px-4 py-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  <!-- Left Column - Venue Details -->
                  <div class="space-y-6">

                      <!-- Hero Image & Title -->
                      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                          <img
                                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"
                                  alt="The Blue Note Jazz Club"
                                  class="w-full h-64 object-cover"
                          />
                          <div class="p-6">
                              <h1 class="text-3xl font-bold text-gray-900 mb-2">The Blue Note Jazz Club</h1>
                              <div class="flex items-center gap-4 mb-4">
                                  <div class="flex items-center">
                                      <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <span class="font-semibold">4.6</span>
                                      <span class="text-gray-600 ml-1">(847 reviews)</span>
                                  </div>
                                  <span class="text-green-600 font-medium">$$$$</span>
                              </div>
                              <p class="text-gray-700 leading-relaxed">
                                  Legendary jazz club featuring world-class musicians in an intimate setting. Known for its exceptional acoustics and historic performances since 1981.
                              </p>
                          </div>
                      </div>

                      <!-- Contact & Location -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Contact & Location</h2>
                          <div class="space-y-3">
                              <div class="flex items-start gap-3">
                                  <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <div>
                                      <p class="text-gray-900">131 W 3rd St, New York, NY 10012</p>
                                      <button class="text-blue-600 text-sm hover:underline" (click)="onGetDirections()">Get directions</button>
                                  </div>
                              </div>

                              <div class="flex items-center gap-3">
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <a href="tel:(212) 475-8592" class="text-blue-600 hover:underline">(212) 475-8592</a>
                              </div>

                              <div class="flex items-center gap-3">
                                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                  </svg>
                                  <a href="https://bluenote.net" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                                      Visit website
                                  </a>
                              </div>
                          </div>
                      </div>

                      <!-- Hours -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Hours</h2>
                          <div class="space-y-2">
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Monday</span>
                                  <span class="text-gray-600">6:00 PM - 1:00 AM</span>
                              </div>
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Tuesday</span>
                                  <span class="text-gray-600">6:00 PM - 1:00 AM</span>
                              </div>
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Wednesday</span>
                                  <span class="text-gray-600">6:00 PM - 1:00 AM</span>
                              </div>
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Thursday</span>
                                  <span class="text-gray-600">6:00 PM - 2:00 AM</span>
                              </div>
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Friday</span>
                                  <span class="text-gray-600">6:00 PM - 2:00 AM</span>
                              </div>
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Saturday</span>
                                  <span class="text-gray-600">6:00 PM - 2:00 AM</span>
                              </div>
                              <div class="flex justify-between">
                                  <span class="font-medium text-gray-700">Sunday</span>
                                  <span class="text-gray-600">6:00 PM - 12:00 AM</span>
                              </div>
                          </div>
                      </div>

                      <!-- Amenities -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                          <div class="flex flex-wrap gap-2">
                              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Live Music</span>
                              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Full Bar</span>
                              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Food Service</span>
                              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Reservations</span>
                              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Wheelchair Accessible</span>
                          </div>
                      </div>
                  </div>

                  <!-- Right Column - Map & Interactive Elements -->
                  <div class="space-y-6">

                      <!-- Map Component -->
                      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                          <div class="h-80 bg-gray-200 flex items-center justify-center">
                              <div class="text-center">
                                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <p class="text-gray-500">Map showing venue location</p>
                                  <p class="text-sm text-gray-400">131 W 3rd St, New York, NY 10012</p>
                              </div>
                          </div>
                      </div>

                      <!-- Nearby Venues -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Nearby Venues</h2>
                          <div class="space-y-3">
                              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                      <h3 class="font-medium text-gray-900">The Village Vanguard</h3>
                                      <p class="text-sm text-gray-600">0.2 miles away</p>
                                  </div>
                                  <button class="text-blue-600 text-sm hover:underline">View</button>
                              </div>
                              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                      <h3 class="font-medium text-gray-900">Smalls Jazz Club</h3>
                                      <p class="text-sm text-gray-600">0.4 miles away</p>
                                  </div>
                                  <button class="text-blue-600 text-sm hover:underline">View</button>
                              </div>
                              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                      <h3 class="font-medium text-gray-900">55 Bar</h3>
                                      <p class="text-sm text-gray-600">0.6 miles away</p>
                                  </div>
                                  <button class="text-blue-600 text-sm hover:underline">View</button>
                              </div>
                          </div>
                      </div>

                      <!-- Quick Actions -->
                      <div class="bg-white rounded-xl shadow-lg p-6">
                          <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                          <div class="grid grid-cols-2 gap-3">
                              <button class="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  Call Now
                              </button>

                              <button class="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                  Directions
                              </button>

                              <button class="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  Save
                              </button>

                              <button class="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                  </svg>
                                  Share
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    
  `
})
export class VenueDetails {

  venueState = inject(VenueStateService);
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
    const venue = this.venueState.$selectedVenue();
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
