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
          <b>Selected Venue: {{$selectedVenue()?.name}}</b>
          <mgl-map
                  [style]="'mapbox://styles/mapbox/streets-v12'"
                  [zoom]="[9]"
                  [center]="mapCenter"
                  (mapCreate)="onMapLoad($event)">

              <ng-container *ngFor="let venue of venuesWithLocation(); trackBy: trackByVenueId">
                  <mgl-marker
                          #venueMarker
                          [lngLat]="[venue.longitude!, venue.latitude!]"
                  >
                      <div class="marker-pin" (click)="selectVenue(venue)">📍</div>
                  </mgl-marker>
<!--                  <mgl-popup [marker]="venueMarker"-->
<!--                             (popupOpen)="whenPopupOpens(venue)"-->
<!--                             (popupClose)="whenPopupCloses(venue)">-->
<!--                      <div [innerHTML]="getPopupHTML(venue)"></div>-->
<!--                  </mgl-popup>-->
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

      /* Style the Mapbox popup close button */
      :global(.mapboxgl-popup-close-button) {
          width: 32px !important;
          height: 32px !important;
          font-size: 20px !important;
          font-weight: bold !important;
          color: #666 !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border-radius: 50% !important;
          border: 2px solid #e0e0e0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          right: 8px !important;
          top: 8px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;

          &:hover {
              background: rgba(255, 255, 255, 1) !important;
              color: #333 !important;
              border-color: #ccc !important;
              transform: scale(1.1) !important;
          }
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

  getPopupHTML(venue: Venue): string {
    return `
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
    `;
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

      // Open a popup for the selected venue with SSR safety
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          import('mapbox-gl').then(mapboxgl => {
            const popup = new mapboxgl.default.Popup()
              .setLngLat([lng, lat])
              .setHTML(this.getPopupHTML(venue))
              .on('open', () => {
                this.whenPopupOpens(venue);
              })
              .on('close', () => {
                this.whenPopupCloses(venue);
              })
              .addTo(this.map)
          });
        }
      }, 100);
    }
  }

  whenPopupOpens(venue: Venue) {
    this.venueState.selectVenue(venue);
  }

  whenPopupCloses(venue: Venue) {
    this.venueState.clearSelectedVenue()
  }

  selectVenue(venue: Venue) {
    this.venueState.selectVenue(venue);
  }

}
