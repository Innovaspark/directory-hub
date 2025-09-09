import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '@core/services/navigation.service';
import { RouterStateService } from "@core/services/router-state.service";
import { VenueStateService } from "@core/services/venue-state.service";

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      <div class="search-panel">
          <div class="search-container">
              <div class="search-form">
                  <!-- City Dropdown -->
                  <div class="form-group">
                      <select
                              id="citySelect"
                              [(ngModel)]="selectedCitySlug"
                              class="city-select"
                      >
                          <option value="">All Cities</option>
                          @for (city of cities; track city.id) {
                          <option [value]="city.slug">
                          {{ city.emoji }} {{ city.name }}
                          </option>
                          }
                      </select>
                  </div>

                  <!-- Search Input -->
                  <div class="form-group search-input-group">
                      <input
                              id="searchInput"
                              type="text"
                              [(ngModel)]="searchTerm"
                              placeholder="Search for venues..."
                              class="search-input"
                              (keyup.enter)="onSearch()"
                      />
                      <button class="clear-btn" (click)="clearSearch()" *ngIf="searchTerm.trim()">
                          ✕
                      </button>
                  </div>

                  <!-- Search Button -->
                  <div class="form-group button-group">
                      <button
                              type="button"
                              (click)="onSearch()"
                              class="search-button"
                      >
                          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                          </svg>
                          Search
                      </button>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: [`
      .search-panel {
          background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
          padding: 24px 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .search-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
      }

      .search-form {
          display: flex;
          gap: 16px;
          align-items: end;
          flex-wrap: wrap;
      }

      .form-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
      }

      .form-group.search-input-group {
          flex: 1;
          min-width: 300px;
          position: relative;
      }

      .form-group.button-group {
          flex-shrink: 0;
      }

      .form-label {
          font-size: 14px;
          font-weight: 600;
          color: white;
          margin-bottom: 6px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .city-select,
      .search-input {
          height: 48px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #374151;
          font-size: 16px;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
      }

      .city-select {
          min-width: 200px;
          padding: 0 16px;
          cursor: pointer;
      }

      .search-input {
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          width: 100%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #374151;
          font-size: 16px;
          transition: all 0.2s ease;
      }

      .city-select:focus,
      .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
          background: white;
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
      }

      .clear-btn:hover {
          color: #666;
      }

      .search-button {
          height: 48px;
          padding: 0 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          min-width: 120px;
          justify-content: center;
      }
      
      .search-icon {
          width: 20px;
          height: 20px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
          .search-form {
              flex-direction: column;
              align-items: stretch;
          }

          .form-group.search-input-group {
              min-width: 0;
          }

          .city-select {
              min-width: 0;
              width: 100%;
          }

          .search-button {
              width: 100%;
          }
      }

      @media (max-width: 640px) {
          .search-container {
              padding: 0 16px;
          }

          .search-panel {
              padding: 20px 0;
          }
      }
  `]
})
export class SearchBarComponent {
  private navigationService = inject(NavigationService);
  private routerState = inject(RouterStateService);
  private venueState = inject(VenueStateService);

  selectedCitySlug = '';
  searchTerm = '';

  // Local hardcoded cities - replace with data service later
  cities = [
    { id: 1, slug: 'amersfoort', name: 'Amersfoort', emoji: '🏙️' },
    { id: 2, slug: 'amsterdam', name: 'Amsterdam', emoji: '🏙️' },
    { id: 3, slug: 'utrecht', name: 'Utrecht', emoji: '🌿' },
    { id: 4, slug: 'rotterdam', name: 'Rotterdam', emoji: '🚢' },
    { id: 5, slug: 'the-hague', name: 'The Hague', emoji: '🏛️' },
    { id: 6, slug: 'eindhoven', name: 'Eindhoven', emoji: '💡' },
    { id: 7, slug: 'groningen', name: 'Groningen', emoji: '🌟' }
  ];

  ngOnInit(): void {
    this.searchTerm = this.routerState.$searchQuery();
    const citySlug = this.routerState.$citySlug();
    if (citySlug && citySlug !== 'all') {
      this.selectedCitySlug = citySlug;
    }
  }

  onSearch(): void {
    this.navigationService.navigateToSearch(
      this.searchTerm, // Can be empty string
      'nl',
      this.selectedCitySlug || undefined
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.venueState.setSearchTerm('');
  }
}
