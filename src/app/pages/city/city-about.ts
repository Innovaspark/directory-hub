// city-about.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {VenueStateService} from "@core/services/venue-state.service";

@Component({
  selector: 'app-city-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="city-about">
      <!-- Header -->
      <section class="about-header">
        <div class="container">
          <nav class="breadcrumb">
            <a [routerLink]="['..']">{{ venueState.$cityName() }}</a>
            <span>About</span>
          </nav>
          <h1>About {{ venueState.$cityName() }}</h1>
          <p>Learn more about {{ venueState.$cityName() }}'s music scene, culture, and entertainment.</p>
        </div>
      </section>

      <!-- Content -->
      <section class="about-content">
        <div class="container">
          <div class="content-grid">
            <div class="main-content">
              <h2>{{ venueState.$cityName() }} Music Scene</h2>
              <p>
                {{ venueState.$cityName() }} has a rich musical heritage spanning decades. The city's diverse 
                neighborhoods each contribute their own flavor to the local music scene, from jazz and blues 
                to rock, electronic, and everything in between.
              </p>

              <h3>Music History</h3>
              <p>
                [This would be populated with scraped/researched content about the city's musical history]
              </p>

              <h3>Popular Neighborhoods for Live Music</h3>
              <p>
                [Content about music districts and neighborhoods would go here]
              </p>

              <h3>Music Festivals & Events</h3>
              <p>
                [Information about annual festivals and recurring events]
              </p>

              <h3>Getting Around</h3>
              <p>
                [Transportation information for getting to venues]
              </p>
            </div>

            <div class="sidebar">
              <div class="info-box">
                <h4>Quick Facts</h4>
                <ul>
                  <li><strong>Live Venues:</strong> {{ venueState.$totalVenueCount() }}</li>
                  <li><strong>Music Genres:</strong> All types</li>
                  <li><strong>Best Time to Visit:</strong> Year-round</li>
                  <li><strong>Average Ticket Price:</strong> Varies</li>
                </ul>
              </div>

              <div class="cta-box">
                <h4>Ready to Explore?</h4>
                <p>Browse all live music venues in {{ venueState.$cityName() }}</p>
                <a [routerLink]="['..', 'venues']" class="btn-primary">
                  View All Venues
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-header {
      background: #f8f9fa;
      padding: 2rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #666;
    }

    .breadcrumb a {
      color: #667eea;
      text-decoration: none;
    }

    .breadcrumb span:last-child {
      color: #333;
      font-weight: 600;
    }

    .about-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .about-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .about-content {
      padding: 3rem 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }

    .main-content h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .main-content h3 {
      font-size: 1.5rem;
      color: #333;
      margin: 2rem 0 1rem 0;
    }

    .main-content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .info-box, .cta-box {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .info-box h4, .cta-box h4 {
      margin-bottom: 1rem;
      color: #333;
      font-size: 1.1rem;
    }

    .info-box ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-box li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
      color: #666;
    }

    .info-box li:last-child {
      border-bottom: none;
    }

    .cta-box p {
      color: #666;
      margin-bottom: 1rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      transition: background 0.2s ease;
    }

    .btn-primary:hover {
      background: #5a67d8;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .about-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CityAboutComponent {
  venueState = inject(VenueStateService);
}
