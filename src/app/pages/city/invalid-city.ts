import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invalid-city',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="invalid-city">
      <div class="local-container">
        <div class="header">
          <h1>This city isn't available yet</h1>
          <p class="subtitle">We're working on expanding to more cities in {{ countryName }}</p>
        </div>

        <div class="suggestions-section">
          <h2>Available cities nearby</h2>
          <div class="city-grid">
            <a [routerLink]="['/nl', 'amsterdam']" class="city-card">
              <span class="city-emoji">🏙️</span>
              <span class="city-name">Amsterdam</span>
              <span class="venue-count">89 venues</span>
            </a>
            <a [routerLink]="['/nl', 'utrecht']" class="city-card">
              <span class="city-emoji">🌿</span>
              <span class="city-name">Utrecht</span>
              <span class="venue-count">34 venues</span>
            </a>
            <a [routerLink]="['/nl', 'rotterdam']" class="city-card">
              <span class="city-emoji">🚢</span>
              <span class="city-name">Rotterdam</span>
              <span class="venue-count">23 venues</span>
            </a>
            <a [routerLink]="['/nl', 'the-hague']" class="city-card">
              <span class="city-emoji">🏛️</span>
              <span class="city-name">The Hague</span>
              <span class="venue-count">18 venues</span>
            </a>
          </div>
        </div>

        <div class="actions-section">
          <a [routerLink]="['/']" class="btn-primary">Browse all locations</a>
          <a [href]="'mailto:hello@gigawhat.live?subject=Add ' + cityName"
             class="btn-secondary">Request {{ cityName }}</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invalid-city {
      min-height: 100vh;
      background: #f8fafc;
      padding: 4rem 0;
    }

    .header {
      text-align: center;
      margin-bottom: 4rem;
    }

    h1 {
      font-size: 3rem;
      color: #1e293b;
      margin-bottom: 1rem;
      font-weight: 800;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #64748b;
      margin: 0;
    }

    .suggestions-section {
      margin-bottom: 4rem;
    }

    h2 {
      font-size: 1.5rem;
      color: #334155;
      margin-bottom: 2rem;
      text-align: center;
    }

    .city-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .city-card {
      background: white;
      padding: 2rem 1.5rem;
      border-radius: 16px;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .city-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }

    .city-emoji {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 1rem;
    }

    .city-name {
      display: block;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .venue-count {
      font-size: 0.9rem;
      color: #64748b;
    }

    .actions-section {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-primary, .btn-secondary {
      display: inline-block;
      padding: 1rem 2rem;
      margin: 0 0.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-primary:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      .invalid-city {
        padding: 2rem 0;
      }

      h1 {
        font-size: 2rem;
      }

      .city-grid {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
      }

      .btn-primary, .btn-secondary {
        display: block;
        margin: 0.5rem 0;
      }
    }
  `]
})
export class InvalidCity implements OnInit, OnDestroy {
  private router = inject(Router);
  private subscription = new Subscription();

  cityName = '';
  countryName = '';

  ngOnInit() {
    // Parse initial URL
    this.parseCurrentUrl();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private parseCurrentUrl() {
    const urlParts = this.router.url.split('/');
    const countryCode = urlParts[1] || '';

    this.countryName = this.getCountryName(countryCode);
  }

  private formatCityName(city: string): string {
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }

  private getCountryName(countryCode: string): string {
    const countries: Record<string, string> = {
      'nl': 'The Netherlands',
      'be': 'Belgium',
      'de': 'Germany'
    };
    return countries[countryCode] || 'this country';
  }
}
