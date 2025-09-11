import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MapComponent
} from 'ngx-mapbox-gl';

@Component({
  selector: 'app-venues-map',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
  ],
  template: `
      <div class="map-container">
          <mgl-map
                  [style]="'mapbox://styles/mapbox/streets-v12'"
                  [zoom]="[9]"
                  [center]="[-74.50, 40]">
          </mgl-map>
      </div>
  `,
  styles: [`
      .map-container {
          height: 100vh;
          width: 100%;
      }

      mgl-map {
          height: 100% !important;
          width: 100% !important;
          display: block !important;
      }

      mgl-map .mapboxgl-canvas {
          height: 100% !important;
          width: 100% !important;
      }
  `]
})
export class VenuesMapComponent {
  map: any;
}
