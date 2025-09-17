// venue-filters.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueStateService } from "@core/state/venue-state.service";

@Component({
  selector: 'app-venue-filters',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="filters-section">
          <div class="local-container">
              <!-- Filter Pills -->
              <div class="filter-pills">
                  <button
                          class="filter-pill"
                          [class.active]="venueState.$selectedVenueType() === null"
                          (click)="venueState.setVenueTypeFilter(null)">
                      All Types
                  </button>
                  @for (venueType of venueState.$filterOptions(); track venueType.slug) {
                  <button
                    class="filter-pill"
                    [class.active]="venueState.$selectedVenueType() === venueType.slug"
                    (click)="venueState.setVenueTypeFilter(venueType.slug)">
                    <i class="fas fa-{{venueType.icon}} mr-2"></i>
                        {{ venueType.label }}
                  </button>
                  }
              </div>
          </div>
      </div>
  `,
  styles: [`
      .filters-section {
          padding: 1.5rem 0;
      }

      .filter-pills {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
      }

      .filter-pill {
          padding: 0.6rem 1.2rem;
          background: #f7f9fc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;

          &:hover {
              background: #edf2f7;
              border-color: #cbd5e0;
              transform: translateY(-1px);
          }

          &.active {
              background: #667eea;
              color: white;
              border-color: #667eea;
          }
      }

      @media (max-width: 768px) {
          .filter-pills {
              gap: 0.5rem;
          }

          .filter-pill {
              font-size: 0.8rem;
              padding: 0.5rem 1rem;
          }
      }
  `]
})
export class VenueFiltersComponent {
  venueState = inject(VenueStateService);
}
