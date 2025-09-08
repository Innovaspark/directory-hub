// invalid-city.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invalid-city',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="invalid-city">
      <div class="container">
        <div class="content">
          <h1>{{ cityName }} Not Available Yet</h1>
          <p>We don't have venue listings for {{ cityName }} in {{ countryName }} yet, but we're expanding!</p>
          
          <div class="suggestions">
            <h3>Try these nearby cities instead:</h3>
            <div class="city-links">
              <a [routerLink]="['/nl', 'amsterdam']" class="city-link">🏙️ Amsterdam</a>
              <a [routerLink]="['/nl', 'utrecht']" class="city-link">🌿 Utrecht</a>
              <a [routerLink]="['/nl', 'amersfoort']" class="city-link">⭐ Amersfoort</a>
            </div>
          </div>

          <div class="actions">
            <a [routerLink]="['/']" class="btn-primary">Browse All Cities</a>
            <a [routerLink]="['/venues']" class="btn-secondary">View All Venues</a>
          </div>

          <div class="request-city">
            <p>Want us to add {{ cityName }}? <a href="mailto:hello@gigawhat.live?subject=Add {{ cityName }}">Let us know!</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invalid-city {
      min-height: 80vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .content {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .suggestions {
      margin: 2rem 0;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .suggestions h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .city-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .city-link {
      background: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      font-weight: 600;
      transition: transform 0.2s ease;
      border: 1px solid #e5e7eb;
    }

    .city-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin: 2rem 0;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
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

    .request-city {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .request-city a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .request-city a:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      h1 {
        font-size: 2rem;
      }

      .city-links {
        flex-direction: column;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class InvalidCity {
  private route = inject(ActivatedRoute);

  cityName = '';
  countryName = '';

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.cityName = this.formatCityName(params['city'] || 'this city');
    this.countryName = this.getCountryName(params['country'] || '');
  }

  private formatCityName(city: string): string {
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }

  private getCountryName(countryCode: string): string {
    const countries: Record<string, string> = {
      'nl': 'Netherlands',
      'be': 'Belgium',
      'de': 'Germany'
    };
    return countries[countryCode] || 'this country';
  }
}
