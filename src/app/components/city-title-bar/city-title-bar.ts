// city-title-bar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-title-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="city-title-bar">
      <div class="container">
        <div class="city-info">
          <h1 class="city-title">
            <span class="city-emoji">{{ cityEmoji }}</span>
            {{ cityName }} {{ venueLabel }}
          </h1>
          <p class="city-subtitle">{{ venueCount }} {{ venueLabel.toLowerCase() }} found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .city-title-bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 0;
    }
    
    .city-info {
      text-align: center;
    }
    
    .city-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }
    
    .city-emoji {
      font-size: 2rem;
    }
    
    .city-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    @media (max-width: 768px) {
      .city-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class CityTitleBar {
  @Input() cityName: string = '';
  @Input() cityEmoji: string = '🏙️';
  @Input() venueCount: number = 0;
  @Input() venueLabel: string = 'Venues';
}
