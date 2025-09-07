// venue-filters.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  slug: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-venue-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-section">
      <div class="container">
        <!-- Search Bar -->
        <div class="search-bar">
          <input 
            type="text" 
            class="search-input" 
            [placeholder]="searchPlaceholder"
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
            name="search">
          <button class="search-btn" (click)="onSearchSubmit()">
            <span>🔍</span>
          </button>
        </div>

        <!-- Filter Pills -->
        <div class="filter-pills">
          <button 
            class="filter-pill"
            [class.active]="selectedFilter === null"
            (click)="onFilterSelect(null)">
            All Types
          </button>
          @for (filter of filterOptions; track filter.slug) {
            <button 
              class="filter-pill"
              [class.active]="selectedFilter === filter.slug"
              (click)="onFilterSelect(filter.slug)">
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
  `]
})
export class VenueFilters {
  @Input() searchPlaceholder: string = 'Search venues...';
  @Input() filterOptions: FilterOption[] = [];
  @Input() selectedFilter: string | null = null;
  @Input() initialSearchQuery: string = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string | null>();

  searchQuery: string = '';

  ngOnInit() {
    this.searchQuery = this.initialSearchQuery;
  }

  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }

  onSearchSubmit() {
    this.searchSubmit.emit(this.searchQuery);
  }

  onFilterSelect(filterSlug: string | null) {
    this.selectedFilter = filterSlug;
    this.filterChange.emit(filterSlug);
  }
}
