// featured-venues.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {VenueStateService} from "@core/services/venue-state.service";

@Component({
  selector: 'app-featured-venues',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="featured-venues-section">
      <div class="container">
        <h2>Featured Venues</h2>
        <p class="featured-venues-subtitle">Discover some of our most popular live music spots</p>
        <div class="featured-venues-grid">
          @for (venue of venueStateService.$featuredVenues(); track venue.id) {
            <a [routerLink]="['/venues', venue.id]" class="featured-venue-card">
              <div class="featured-venue-image">
                <img [src]="venue.photo || defaultImage" [alt]="venue.name" />
                <div class="featured-venue-badge">Featured</div>
              </div>
              <div class="featured-venue-content">
                <h3>{{ venue.name }}</h3>
                <p class="featured-venue-location">{{ venue.city || venue.full_address }}</p>
                <p class="featured-venue-description">{{ venue.keywords || 'Live music venue' }}</p>
              </div>
            </a>
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

    .featured-venues-section {
      padding: 4rem 0;
      background: white;
    }

    .featured-venues-section h2 {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #333;
    }

    .featured-venues-subtitle {
      text-align: center;
      font-size: 1.1rem;
      color: #666;
      margin-bottom: 3rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .featured-venues-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .featured-venue-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #f0f0f0;
    }

    .featured-venue-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      color: inherit;
    }

    .featured-venue-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: #f8f9fa;
    }

    .featured-venue-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .featured-venue-card:hover .featured-venue-image img {
      transform: scale(1.05);
    }

    .featured-venue-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #059669;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .featured-venue-content {
      padding: 1.5rem;
    }

    .featured-venue-content h3 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .featured-venue-location {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.8rem;
      font-weight: 500;
    }

    .featured-venue-description {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .featured-venues-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .featured-venue-image {
        height: 160px;
      }

      .featured-venues-section {
        padding: 3rem 0;
      }
    }
  `]
})
export class FeaturedVenuesComponent {
  readonly venueStateService = inject(VenueStateService);

  // Default image for venues without photos
  readonly defaultImage = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop';
}
