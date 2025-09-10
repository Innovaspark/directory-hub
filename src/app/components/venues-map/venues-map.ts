import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { VenueStateService } from '@core/services/venue-state.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-venues-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  template: `
      <div
              leaflet
              [leafletOptions]="options"
              [leafletLayers]="markerLayers"
              style="height: 600px; width: 100%;"
              class="map-container">
      </div>
  `,
  styles: [`
      @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

      .map-container {
          height: 600px !important;
          width: 100% !important;
          border-radius: 8px;
      }
      .map-container .leaflet-container {
          height: 100% !important;
          width: 100% !important;
      }
  `]
})
export class VenuesMap implements OnInit, AfterViewInit {
  private venueState = inject(VenueStateService);
  private map?: L.Map;

  $venues = this.venueState.$filteredVenues;

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 10,
    center: L.latLng(52.0907, 5.1214) // Netherlands center
  };

  markerLayers: L.Layer[] = [];

  ngOnInit() {
    this.updateMarkers();

    // Subscribe to venue changes
    this.$venues().forEach(() => {
      this.updateMarkers();
    });
  }

  ngAfterViewInit() {
    // Force map resize after view is ready
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  onMapReady(map: L.Map) {
    this.map = map;

    // Multiple resize attempts to ensure proper sizing
    setTimeout(() => {
      map.invalidateSize();

      // Set explicit view if venues exist
      const venues = this.$venues();
      if (venues.length > 0) {
        const validVenues = venues.filter(v => v.latitude && v.longitude);
        if (validVenues.length > 0) {
          const group = new L.FeatureGroup(this.markerLayers);
          map.fitBounds(group.getBounds().pad(0.1));
        }
      }
    }, 200);

    // Additional resize after longer delay
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }

  private updateMarkers() {
    this.markerLayers = [];

    const venues = this.$venues();

    venues.forEach(venue => {
      if (venue.latitude && venue.longitude) {
        const marker = L.marker([venue.latitude, venue.longitude])
          .bindPopup(`
            <div>
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${venue.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;">${venue.review_summary || ''}</p>
              <div style="font-size: 14px;">
                ⭐ ${venue.rating} (${venue.review_count} reviews)
              </div>
            </div>
          `);

        this.markerLayers.push(marker);;
      }
    });
  }
}
