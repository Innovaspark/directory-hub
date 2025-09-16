// popular-countries.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationStateService } from '@core/state/location-state.service';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-popular-countries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="countries-section">
      <div class="container">
        <h2>Explore Countries</h2>
        <p class="countries-subtitle">Discover live music venues around the world</p>
        <div class="countries-grid">
          @for (country of locationService.$allCountries(); track country.code) {
            <button
              (click)="navigateToCountry(country.code)"
              class="country-card">
              <span class="country-emoji">{{ country.emoji }}</span>
              <span class="country-name">{{ country.name }}</span>
              <span class="country-cities">{{ getCityCount(country.code) }} cities</span>
            </button>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .countries-section {
      padding: 4rem 0;
      background: #fafafa;
    }

    .countries-section h2 {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #333;
    }

    .countries-subtitle {
      text-align: center;
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 3rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .countries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .country-card {
      background: white;
      padding: 2rem 1.5rem;
      border-radius: 16px;
      border: none;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
    }

    .country-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #1f2937, #374151, #4b5563);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .country-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(31, 41, 55, 0.15);
    }

    .country-card:hover::before {
      transform: scaleX(1);
    }

    .country-emoji {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .country-name {
      display: block;
      font-size: 1.4rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .country-cities {
      color: #666;
      font-size: 1rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .countries-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }

      .country-card {
        padding: 1.5rem 1rem;
      }

      .country-emoji {
        font-size: 2.5rem;
      }

      .country-name {
        font-size: 1.2rem;
      }

      .country-cities {
        font-size: 0.9rem;
      }
    }
  `]
})
export class PopularCountriesComponent {
  readonly locationService = inject(LocationStateService);
  private navigationService = inject(NavigationService);

  navigateToCountry(countryCode: string): void {
    this.navigationService.navigateToCountry(countryCode);
  }

  getCityCount(countryCode: string): number {
    return this.locationService.$citiesInCountry(countryCode)().length;
  }
}
