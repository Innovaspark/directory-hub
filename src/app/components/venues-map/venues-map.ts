import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MapComponent,
  MarkerComponent,
  PopupComponent
} from 'ngx-mapbox-gl';
import { Venue } from '@core/models/venue.model';
import { VenueStateService } from '@core/services/venue-state.service';

@Component({
  selector: 'app-venues-map',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    MarkerComponent,
    PopupComponent,
  ],
  template: `
      <div class="map-container">
          <mgl-map
                  [style]="'mapbox://styles/mapbox/streets-v12'"
                  [zoom]="[9]"
                  [center]="mapCenter"
                  (mapCreate)="onMapLoad($event)">

              <ng-container *ngFor="let venue of venuesWithLocation(); trackBy: trackByVenueId">
                  <mgl-marker
                          #venueMarker
                          [lngLat]="[venue.longitude!, venue.latitude!]">
                      <div class="marker-pin">📍</div>
                  </mgl-marker>
                  <mgl-popup [marker]="venueMarker">
                      <div class="venue-popup">
                          <h3>{{ venue.name }}</h3>
                          <p *ngIf="venue.full_address">{{ venue.full_address }}</p>
                          <div *ngIf="venue.rating" class="rating">
                              ⭐ {{ venue.rating }}
                              <span *ngIf="venue.review_count">({{ venue.review_count }} reviews)</span>
                          </div>
                          <div *ngIf="venue.phone" class="phone">📞 {{ venue.phone }}</div>
                      </div>
                  </mgl-popup>
              </ng-container>
          </mgl-map>
      </div>
  `,
  styles: [`
      .map-container {
          height: 100vh;
          width: 100%;
          position: relative;
      }

      mgl-map {
          height: 100% !important;
          width: 100% !important;
          display: block !important;
      }

      .marker-pin {
          font-size: 20px;
          cursor: pointer;
      }

      .venue-popup {
          min-width: 200px;
          padding: 8px;
      }

      .venue-popup h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: bold;
      }

      .venue-popup p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #666;
      }

      .rating {
          font-size: 14px;
          margin-bottom: 4px;
      }

      .phone {
          font-size: 14px;
          color: #27ae60;
      }
  `]
})
export class VenuesMapComponent {
  private venueState = inject(VenueStateService);

  $venues = this.venueState.$filteredVenues;
  $selectedVenue = this.venueState.$selectedVenue;
  map: any;
  mapCenter: [number, number] = [5.1214, 52.0907]; // Default center

  // Filter venues that have location data - as a computed signal
  venuesWithLocation = computed(() =>
    this.$venues().filter(venue =>
      venue.latitude !== null &&
      venue.longitude !== null &&
      venue.latitude !== undefined &&
      venue.longitude !== undefined
    )
  );

  constructor() {
    // Calculate initial center once when component initializes
    effect(() => {
      const venues = this.venuesWithLocation();
      if (venues.length > 0 && this.mapCenter[0] === 5.1214 && this.mapCenter[1] === 52.0907) {
        // Only calculate once when we first get venues
        const avgLng = venues.reduce((sum, venue) => sum + venue.longitude!, 0) / venues.length;
        const avgLat = venues.reduce((sum, venue) => sum + venue.latitude!, 0) / venues.length;
        this.mapCenter = [avgLng, avgLat];
      }
    });

    // Watch for zoom requests - but only when map is available
    effect(() => {
      const selectedVenue = this.$selectedVenue();

      if (selectedVenue && this.map) {
        // Add a small delay to ensure map is fully ready
        setTimeout(() => {
          this.zoomToVenueLocation(selectedVenue);
        }, 50);
      }
    });
  }

  trackByVenueId(index: number, venue: Venue): string {
    return venue.id;
  }

  onMapLoad(map: any) {
    this.map = map;

    // Trigger resize after map loads to ensure proper sizing
    setTimeout(() => {
      map.resize();

      // Check if there's already a selected venue to zoom to
      const selectedVenue = this.$selectedVenue();
      if (selectedVenue) {
        this.zoomToVenueLocation(selectedVenue);
      }
    }, 200);
  }

  zoomToVenueLocation(venue: Venue) {
    if (venue.latitude && venue.longitude && this.map) {
      // Make sure coordinates are numbers and in correct order [lng, lat]
      const lng = Number(venue.longitude);
      const lat = Number(venue.latitude);

      // Try setting center and zoom separately
      this.map.setCenter([lng, lat]);
      this.map.setZoom(18);

      // Open a popup for the selected venue
      setTimeout(() => {
        const popup = new mapboxgl.Popup()
          .setLngLat([lng, lat])
          .setHTML(`
            <div class="venue-popup">
              <h3>${venue.name}</h3>
              ${venue.full_address ? `<p>${venue.full_address}</p>` : ''}
              ${venue.rating ? `
                <div class="rating">
                  ⭐ ${venue.rating} 
                  ${venue.review_count ? `(${venue.review_count} reviews)` : ''}
                </div>
              ` : ''}
              ${venue.phone ? `<div class="phone">📞 ${venue.phone}</div>` : ''}
            </div>
          `)
          .addTo(this.map);
      }, 100);
    }
  }
}
