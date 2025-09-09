// country-cities.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationStateService } from '@core/services/location-state.service';
import { NavigationService } from '@core/services/navigation.service';
import { CarouselComponent } from '@components/carousel/carousel';

@Component({
  selector: 'app-country-cities',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  template: `
    <section class="cities-section">
      <div class="container">
        <h2>Explore Cities</h2>
        <p class="cities-subtitle">Browse venues by city in {{ $currentCountry()?.name }}</p>

        <app-carousel [scrollAmount]="180">
          @for (city of $citiesInCountry(); track city.slug) {
            <button 
              (click)="navigateToCity(city.slug)"
              class="city-card">
              <span class="city-emoji">{{ city.emoji }}</span>
              <span class="city-name">{{ city.name }}</span>
              <span class="city-venues">{{ city.venueCount || 0 }} venues</span>
            </button>
          }
        </app-carousel>
      </div>
    </section>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .cities-section {
      padding: 3rem 0;
      background: white;
    }

    .cities-section h2 {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .cities-subtitle {
      text-align: center;
      font-size: 1rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .city-card {
      background: white;
      padding: 1.5rem 1rem;
      border-radius: 12px;
      border: 2px solid #f0f0f0;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      position: relative;
      overflow: hidden;
      width: 140px;
      flex-shrink: 0;
    }

    .city-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .city-card:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
      border-color: #e2e8f0;
    }

    .city-card:hover::before {
      transform: scaleX(1);
    }

    .city-emoji {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .city-name {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.3rem;
      white-space: nowrap;
    }

    .city-venues {
      color: #667eea;
      font-size: 0.8rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .city-card {
        width: 120px;
        padding: 1.2rem 0.8rem;
      }

      .city-emoji {
        font-size: 1.8rem;
      }

      .city-name {
        font-size: 0.9rem;
      }

      .city-venues {
        font-size: 0.75rem;
      }
    }
  `]
})
export class CountryCitiesComponent {
  private locationService = inject(LocationStateService);
  private navigationService = inject(NavigationService);

  readonly $currentCountry = this.locationService.$currentCountry;
  readonly $citiesInCountry = this.locationService.$citiesInCurrentCountry;

  navigateToCity(citySlug: string | undefined): void {
    if (!citySlug) {
      alert('no such city!');
      return;
    }
    const country = this.$currentCountry();
    if (country) {
      this.navigationService.navigateToCity(country.code, citySlug);
    }
  }
}
