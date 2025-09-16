// venues-dump.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VenueStateService} from "@core/state/venue-state.service";
import {RouterStateService} from "@core/state/router-state.service";

@Component({
  selector: 'app-venues-dump',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="venues-dump">
      <div class="container">
        <h3>Venues Debug Info</h3>

        <div class="debug-info">

            <p><strong>Current URL:</strong> {{ routerState.$url() }}</p>
            <p><strong>City Slug:</strong> {{ routerState.$citySlug() }}</p>
            <p><strong>Query Params:</strong> {{ routerState.$queryParams() | json }}</p>

            <p><strong>City:</strong> {{ venueState.$cityName() }} {{ venueState.$cityEmoji() }}</p>
          <p><strong>Search Query:</strong> "{{ venueState.$searchQuery() }}"</p>
          <p><strong>Selected Filter:</strong> {{ venueState.$selectedFilter() || 'None' }}</p>
          <p><strong>Loading:</strong> {{ venueState.$isLoading() }}</p>
          <p><strong>Filtered Venues Count:</strong> {{ venueState.$venueCount() }}</p>
          <p><strong>Total Venues Count:</strong> {{ venueState.$totalVenueCount() }}</p>
        </div>

        <div class="venues-list">
          <h4>Venues ({{ venueState.$venues().length }})</h4>
          @if (venueState.$isLoading()) {
            <p>Loading...</p>
          } @else {
            @for (venue of venueState.$venues(); track venue.id) {
              <div class="venue-item">
                <strong>{{ venue.name }}</strong><br>
                <small>{{ venue.city }} • {{ venue.primary_type }}</small><br>
                @if (venue.keywords) {
                  <small>Keywords: {{ venue.keywords }}</small>
                }
              </div>
            } @empty {
              <p>No venues found</p>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .venues-dump {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      margin: 1rem 0;
      border-radius: 8px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    .debug-info {
      background: #e9ecef;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-family: monospace;
    }

    .debug-info p {
      margin: 0.25rem 0;
    }

    .venues-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #dee2e6;
      padding: 1rem;
      border-radius: 4px;
      background: white;
    }

    .venue-item {
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
      font-size: 0.9rem;
    }

    .venue-item:last-child {
      border-bottom: none;
    }

    h3, h4 {
      color: #495057;
      margin-bottom: 0.5rem;
    }
  `]
})
export class VenuesDumpComponent {
  venueState = inject(VenueStateService);
  routerState = inject(RouterStateService);
}
