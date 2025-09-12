import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryHeroComponent } from '@components/country-hero/country-hero';
import {SeoService} from "@core/services/seo.service";

@Component({
  selector: 'app-country-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    CountryHeroComponent,
  ],
  template: `
    <div class="country-landing">
      <app-country-hero></app-country-hero>
<!--        <app-country-cities></app-country-cities>-->
    </div>
  `,
  styles: [`
    .country-landing {
      min-height: 100vh;
    }
  `]
})
export class CountryLandingPageComponent {

  private seo = inject(SeoService);

  constructor() {
    this.setSeo();
  }

  private setSeo() {
    this.seo.setMeta({
      title: 'Live Music in the Netherlands - Venues, Gigs & Festivals',
      description: 'Discover live music venues, concerts, festivals, open mics, jam sessions, and gigs across the Netherlands. Find the best live music events near you.',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Netherlands Live Music",
        "url": undefined, // SeoService will auto-fill current URL
        "description": "Discover live music venues, concerts, festivals, open mics, jam sessions, and gigs across the Netherlands. Find the best live music events near you."
      }
    });
  }

}
