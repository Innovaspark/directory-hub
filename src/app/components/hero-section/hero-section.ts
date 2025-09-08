// hero-section.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationService} from "@core/services/navigation.service";

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
      <section class="hero">
          <div class="container">
              <h1>GigaWhat</h1>
              <p class="tagline">The complete directory of live music venues</p>
              <p class="description">Discover venues, check what's playing, and never miss the music that matters to you</p>

              <div class="cta-section">
                  <p class="cta-text">Choose your country to start exploring</p>
                  <button class="cta-btn" (click)="navigateToNetherlands()">
                      🇳🇱 Explore Netherlands
                  </button>
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

      .tagline {
          font-size: 1.3rem;
          opacity: 0.95;
          margin-bottom: 1rem;
          font-weight: 500;
      }

      .description {
          font-size: 1rem;
          opacity: 0.85;
          margin-bottom: 2.5rem;
          font-weight: 300;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
      }

      .cta-section {
          text-align: center;
      }

      .cta-text {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
      }

      @media (max-width: 768px) {
          .tagline {
              font-size: 1.1rem;
          }

          .description {
              font-size: 0.95rem;
              margin-bottom: 2rem;
          }

          .cta-text {
              font-size: 1rem;
              margin-bottom: 1rem;
          }
      }
  `]
})
export class HeroSectionComponent {
  private navigationService = inject(NavigationService);

  navigateToNetherlands() {
    this.navigationService.navigateToCountry('nl');
  }
}
