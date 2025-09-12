import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent, MarkerComponent } from 'ngx-mapbox-gl';
import { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import { Venue } from '@core/models/venue.model';

@Component({
  selector: 'app-venue-map',
  standalone: true,
  imports: [CommonModule, MapComponent, MarkerComponent],
  template: `
      <div class="map-container">
      <mgl-map
              [style]="'mapbox://styles/mapbox/streets-v12'"
              [zoom]="[9]"
              [center]="mapCenter"
              (mapCreate)="onMapLoad($event)">

              <mgl-marker
                      #venueMarker
                      [lngLat]="[venue()?.longitude!, venue()?.latitude!]"
              >
                  <div class="marker-pin" (click)="selectVenue(venue())">📍</div>
              </mgl-marker>
      </mgl-map>
      </div>
  `,
  styles: [`

      .map-container {
          height: 100%;
          width: 100%;
          min-height: 500px;
          position: relative;
      }

      mgl-map {
          height: 100% !important;
          width: 100% !important;
          display: block !important;
      }

      .marker-pin {
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .mapboxgl-map {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          height: 100% !important;
          width: 100% !important;
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
  // mapCenter = computed((): LngLatLike => {
  //   const venueData = this.venue();
  //   return [venueData?.longitude || 0, venueData?.latitude || 0];
  // });
  mapCenter: [number, number] = [5.1214, 52.0907]; // Default center

  private map?: MapboxMap;

  onMapLoad(map: MapboxMap) {
    this.map = map;

    // Optional: Add venue name popup that shows on load
    const venueData = this.venue();
    if (this.hasValidCoordinates() && venueData?.name) {
      // You could add a popup here if desired
      // map.on('load', () => {
      //   const popup = new mapboxgl.Popup({ offset: 25 })
      //     .setHTML(`<div class="font-semibold">${venueData.name}</div>`)
      //     .setLngLat([venueData.longitude!, venueData.latitude!])
      //     .addTo(map);
      // });
    }
  }

  selectVenue(venue: Venue | null | undefined) {
    alert('venue selected')
  }
}
