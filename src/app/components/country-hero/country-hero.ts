// country-hero.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationStateService } from '@core/state/location-state.service';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-country-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="hero">
      <div class="hero-container">
        <div class="hero-country-content">
          <h1>
            <span class="country-emoji">{{ $currentCountry()?.emoji }}</span>
            Live Music in {{ $currentCountry()?.name }}
          </h1>
          <p class="hero-description">{{ $currentCountry()?.description }}</p>

          <!-- Country-scoped Search -->
          <div class="search-box">
            <div class="search-input-group">
              <input
                type="text"
                [placeholder]="'Search venues in ' + $currentCountry()?.name + '...'"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                class="search-input">
              <button class="cta-btn" (click)="onSearch()">
                Find Venues
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`

    .hero-country-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .country-emoji {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .search-box {
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input-group {
      display: flex;
      background: white;
      border-radius: 50px;
      padding: 4px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .search-input {
      flex: 1;
      border: none;
      padding: 1rem 1.5rem;
      font-size: 1.1rem;
      background: transparent;
      outline: none;
      color: #333;
    }

    .search-input::placeholder {
      color: #999;
    }

    @media (max-width: 768px) {
      .country-emoji {
        font-size: 3rem;
      }

      .hero-description {
        font-size: 1rem;
        margin-bottom: 2rem;
      }

      .search-input-group {
        flex-direction: column;
        border-radius: 16px;
      }
    }
  `]
})
export class CountryHeroComponent {
  private locationService = inject(LocationStateService);
  private navigationService = inject(NavigationService);

  readonly $currentCountry = this.locationService.$currentCountry;

  searchQuery = '';

  onSearch() {
    const country = this.$currentCountry();
    if (country) {
      this.navigationService.navigateToSearch(this.searchQuery, country.code);
    }
  }

}
