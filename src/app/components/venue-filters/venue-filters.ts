// venue-filters.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {VenueStateService} from "@core/services/venue-state.service";

@Component({
  selector: 'app-venue-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      <div class="filters-section">
          <div class="container">
              <!-- Search Bar -->
              <div class="search-bar">
                  <div class="search-input-container">
                      <input
                              type="text"
                              class="search-input"
                              [placeholder]="searchPlaceholder()"
                              [(ngModel)]="localSearchQuery"
                              (keyup.enter)="onSearchSubmit()"
                              name="search">
                      @if (localSearchQuery) {
                      <button class="clear-btn" (click)="clearSearch()">
                        ✕
                      </button>
                      }
                  </div>
                  <button class="search-btn" (click)="onSearchSubmit()">
                      <span>🔍</span>
                  </button>
              </div>

              <!-- Filter Pills -->
              <div class="filter-pills">
                  <button
                          class="filter-pill"
                          [class.active]="venueState.selectedFilter() === null"
                          (click)="venueState.setFilter(null)">
                      All Types
                  </button>
                  @for (filter of venueState.filterOptions(); track filter.slug) {
                  <button 
                    class="filter-pill"
                    [class.active]="venueState.selectedFilter() === filter.slug"
                    (click)="venueState.setFilter(filter.slug)">
                  {{ filter.icon }} {{ filter.label }}
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

      .search-bar {
          display: flex;
          max-width: 500px;
          margin: 0 auto 1.5rem;
          gap: 0.5rem;
      }

      .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e1e5e9;
          border-radius: 25px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease;
          width: 100%;

          &:focus {
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
      }

      .search-btn {
          padding: 0.75rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: background 0.3s ease;

          &:hover {
              background: #5a67d8;
          }
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

      .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
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

      .search-input-container {
          position: relative;
          flex: 1;
      }

      .clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
              color: #666;
          }
      }
      
  `]
})
export class VenueFiltersComponent {
  venueState = inject(VenueStateService);

  localSearchQuery = '';

  ngOnInit() {
    // Initialize local search with current state
    this.localSearchQuery = this.venueState.searchQuery();
  }

  searchPlaceholder = () => {
    const cityName = this.venueState.cityName();
    return cityName
      ? `Search venues in ${cityName}...`
      : 'Search venues...';
  };

  onSearchSubmit() {
    this.venueState.setSearchQuery(this.localSearchQuery);
  }

  clearSearch() {
    this.localSearchQuery = '';
    this.venueState.setSearchQuery('');
  }

}
