// hero-section.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationService} from "@core/services/navigation.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
      <section class="hero">
          <div class="container">
              <div class="hero-content">
                  <div class="logo-section">
                      <div class="hero-logo">
                          <!-- Replace with your actual logo -->
                          <div class="logo">
                              <a [routerLink]="'/'">
                                  <img src="/images/logos/main-logo.svg"
                                       alt="GigaWhat.live"
                                       class="logo-img"
                                       [class.logo-large]="true">
                              </a>
                          </div>

                      </div>
                  </div>

                  <div class="text-section">
                      <h1 class="hero-title">GigaWhat</h1>
                      <p class="tagline">The Netherlands' Complete Live Music Directory</p>
                      <p class="description">From intimate jazz clubs to legendary concert halls – discover every venue where music comes alive across the Netherlands. Find your next musical adventure.</p>

                      <div class="cta-section">
                          <button class="cta-btn" (click)="navigateToNetherlands()">
                              <span class="btn-icon">🎵</span>
                              <span class="btn-text">Explore Live Music Venues</span>
                              <span class="btn-arrow">→</span>
                          </button>
                          <p class="subtitle">Discover venues in Amsterdam, Rotterdam, The Hague & beyond</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  `,
  styles: [`
      .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
          min-height: 600px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
      }

      .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.3;
      }

      .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          position: relative;
          z-index: 2;
      }

      .hero-content {
          display: flex;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
      }

      .logo-section {
          flex: 0 0 auto;
      }

      .hero-logo {
          animation: float 6s ease-in-out infinite;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
      }

      .text-section {
          flex: 1;
          min-width: 400px;
      }

      .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #ffffff, #f0f9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          line-height: 1.1;
      }

      .tagline {
          font-size: 1.4rem;
          opacity: 0.95;
          margin-bottom: 1.2rem;
          font-weight: 600;
          color: #e0f2fe;
      }

      .description {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2.5rem;
          font-weight: 400;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
      }

      .cta-section {
          text-align: left;
      }

      .cta-btn {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
          margin-bottom: 1rem;
      }

      .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
          background: linear-gradient(45deg, #ff5252, #d32f2f);
      }

      .btn-icon {
          font-size: 1.2rem;
      }

      .btn-text {
          font-weight: 600;
      }

      .btn-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
      }

      .cta-btn:hover .btn-arrow {
          transform: translateX(4px);
      }

      .subtitle {
          font-size: 0.95rem;
          opacity: 0.8;
          color: #e1f5fe;
          font-weight: 400;
      }

      @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
      }

      @media (max-width: 768px) {
          .hero {
              padding: 3rem 0;
              min-height: 500px;
          }

          .hero-content {
              flex-direction: column;
              text-align: center;
              gap: 2rem;
          }

          .text-section {
              min-width: auto;
          }

          .hero-title {
              font-size: 2.5rem;
          }

          .tagline {
              font-size: 1.2rem;
          }

          .description {
              font-size: 1rem;
              margin-bottom: 2rem;
          }

          .cta-section {
              text-align: center;
          }

          .cta-btn {
              padding: 0.875rem 1.75rem;
              font-size: 1rem;
          }
      }

      @media (max-width: 480px) {
          .hero-logo svg {
              width: 80px;
              height: 80px;
          }

          .hero-title {
              font-size: 2rem;
          }

          .hero-content {
              gap: 1.5rem;
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
