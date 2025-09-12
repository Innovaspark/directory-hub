import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent, MarkerComponent } from 'ngx-mapbox-gl';
import { Venue } from '@core/models/venue.model';

@Component({
  selector: 'app-single-venue-map',
  standalone: true,
  imports: [CommonModule, MapComponent, MarkerComponent],
  template: `
      @if (hasValidCoordinates()) {
      <div class="map-container">
      <mgl-map
      [style]="'mapbox://styles/mapbox/streets-v12'"
      [zoom]="[15]"
      [center]="mapCenter()"
      (mapCreate)="onMapLoad($event)">

      <mgl-marker
      [lngLat]="[venue()!.longitude!, venue()!.latitude!]">
      <div class="marker-pin">📍</div>
      </mgl-marker>
      </mgl-map>
      </div>
      } @else {
      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
      <div class="text-center text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 616 0z" />
      </svg>
      <p>Location not available</p>
      </div>
      </div>
      }
  `,
  styles: [`
      .map-container {
          height: 100%;
          width: 100%;
          position: relative;
      }

      mgl-map {
          height: 100% !important;
          width: 100% !important;
          display: block !important;
      }

      .marker-pin {
          font-size: 24px;
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .marker-pin:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
      }
  `]
})
export class SingleVenueMapComponent {
  venue = input<Venue | null>();

  // Check if venue exists and has valid coordinates
  hasValidCoordinates = computed(() => {
    const venueData = this.venue();
    return venueData != null &&
      venueData?.latitude != null &&
      venueData?.longitude != null &&
      !isNaN(venueData.latitude) &&
      !isNaN(venueData.longitude);
  });

  // Center map on venue coordinates
  mapCenter = computed((): [number, number] => {
    const venueData = this.venue();
    return [venueData?.longitude || 0, venueData?.latitude || 0];
  });

  private map?: any;

  onMapLoad(map: any) {
    this.map = map;

    // Trigger resize after map loads to ensure proper sizing
    setTimeout(() => {
      map.resize();
    }, 200);
  }
}
