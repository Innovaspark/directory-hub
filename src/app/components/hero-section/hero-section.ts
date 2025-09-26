import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@core/services/navigation.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
      <section class="hero">
          <div class="hero-container">

              <!-- Centered heading & tagline -->
              <div class="hero-header text-center">
                  <h1 class="hero-title">GigaWhat</h1>
                  <p class="tagline">Your Curated Guide to Live Music in the Netherlands</p>
              </div>

              <!-- Logo & description side by side -->
              <div class="hero-content">
                  <div class="logo-section">
                      <div class="hero-logo">
                          <div class="logo">
                              <a [routerLink]="'/'">
                                  <img src="/images/logos/main-logo.svg"
                                       alt="GigaWhat.live"
                                       class="logo-img logo-large">
                              </a>
                          </div>
                      </div>
                  </div>

                  <div class="text-section">
                      <p class="description">
                          From intimate jazz clubs to legendary concert halls – discover every venue where music comes
                          alive across the Netherlands. Find your next musical gig adventure.
                      </p>
                  </div>
              </div>

              <!-- Centered CTA -->
              <div class="cta-section text-center">
                  <button class="cta-btn cta-button-normal" (click)="navigateToExplore()">
                      <span class="btn-icon">🎵</span>
                      <span class="btn-text">Explore Live Music Venues</span>
                      <span class="btn-arrow">→</span>
                  </button>
                  <p class="subtitle">Discover gigs, open mics, jam session, bands and concerts</p>
              </div>

          </div>
      </section>
  `,
  styles: [`
  `]
})
export class HeroSectionComponent {
  private navigationService = inject(NavigationService);

  navigateToExplore() {
    this.navigationService.navigateToVenues('nl');
  }
}
