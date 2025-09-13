// city-landing.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {VenueStateService} from "@core/services/venue-state.service";
import {RouterStateService} from "@core/services/router-state.service";
import {SeoService} from "@core/services/seo.service";

@Component({
  selector: 'app-city-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="city-landing">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1>Live Music in {{ venueState.$cityName() }} - Best Venues & Events</h1>
          <p class="hero-subtitle">
            Discover {{ venueState.$totalVenueCount() }} live music venues in {{ venueState.$cityName() }}. 
            From intimate jazz clubs to major concert halls, find concerts, gigs, and live events tonight.
          </p>
          <div class="hero-stats">
            <span>{{ venueState.$totalVenueCount() }} Venues</span>
            <span>All Music Genres</span>
            <span>Updated Daily</span>
          </div>
          <div class="hero-cta">
            <a [routerLink]="['venues']" class="btn-primary">
              Browse All {{ venueState.$cityName() }} Venues
            </a>
            <a [routerLink]="['about']" class="btn-secondary">
              About {{ venueState.$cityName() }}
            </a>
          </div>
        </div>
      </section>

      <!-- Quick Venue Types -->
      <section class="venue-types">
        <div class="container">
          <h2>Find {{ venueState.$cityName() }} Venues By Type</h2>
          <div class="types-grid">
            @for (type of venueState.$filterOptions(); track type.slug) {
              <a [routerLink]="['venues']" [queryParams]="{type: type.slug}" class="type-card">
                <span class="type-icon">{{ type.icon }}</span>
                <span class="type-label">{{ type.label }}</span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- SEO Content -->
      <section class="seo-content">
        <div class="container">
          <h2>{{ venueState.$cityName() }} Live Music Scene</h2>
          <p>
            {{ venueState.$cityName() }} offers an incredible variety of live music venues, from world-class concert halls 
            to intimate neighborhood bars. Whether you're looking for rock concerts, jazz performances, electronic music, 
            or acoustic sets, {{ venueState.$cityName() }} has something for every music lover.
          </p>
          
          <h3>Popular Music Venues in {{ venueState.$cityName() }}</h3>
          <p>
            The {{ venueState.$cityName() }} music scene features everything from historic theaters to cutting-edge clubs. 
            Live music happens every night of the week, with local bands and touring artists performing across the city.
          </p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.9;
      line-height: 1.5;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .hero-cta {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.5);
    }

    .btn-primary:hover, .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .venue-types {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .venue-types h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
      color: #333;
    }

    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .type-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s ease;
      border: 1px solid #e5e7eb;
    }

    .type-card:hover {
      transform: translateY(-4px);
    }

    .type-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .type-label {
      font-weight: 600;
      color: #333;
    }

    .seo-content {
      padding: 4rem 0;
    }

    .seo-content h2, .seo-content h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .seo-content h2 {
      font-size: 2rem;
    }

    .seo-content h3 {
      font-size: 1.5rem;
      margin-top: 2rem;
    }

    .seo-content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.2rem;
      }

      .hero-stats {
        flex-direction: column;
        gap: 0.5rem;
      }

      .hero-cta {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class CityLandingComponent {
  venueState = inject(VenueStateService);
  private seo = inject(SeoService);
  private routerState = inject(RouterStateService);

  ngOnInit() {
    const citySlug = this.routerState.$citySlug();

    if (citySlug) {
      this.seo.setMeta({
        title: `${citySlug} Live Music – Jam Sessions, Open Mics & Live Bands | GigaWhat`,
        description: `Discover jam sessions, open mics, live bands, concerts, and gigs in ${citySlug}. Explore the best live music venues and festivals with GigaWhat.`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "City",
          "name": citySlug,
          "description": `Live music in ${citySlug}: jam sessions, open mics, live bands, concerts, festivals, and gigs.`,
        },
      });
    }
  }

}
