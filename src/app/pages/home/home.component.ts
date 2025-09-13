// home.component.ts
import {Component, inject} from '@angular/core';
import {FeaturedVenuesComponent} from "@components/featured-venues/featured-venues";
import {HeroSectionComponent} from "@components/hero-section/hero-section";
import {SearchBarComponent} from "@components/search-bar/search-bar";
import {SeoService} from "@core/services/seo.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, SearchBarComponent, FeaturedVenuesComponent],
  template: `
      <div class="home">
          <app-search-bar></app-search-bar>
          <app-hero-section></app-hero-section>
<!--          <app-popular-countries></app-popular-countries>-->
          <app-featured-venues></app-featured-venues>
      </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
    }
  `]
})
export class HomeComponent {

  private seo = inject(SeoService);

  constructor() {
    this.setSeo();
  }

  private setSeo() {
    this.seo.setMeta({
      title: 'Discover Live Music Venues in the Netherlands',
      description: 'Explore live music venues, concerts, festivals, open mics, jam sessions, and gigs across the Netherlands.',
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GigaWhat",
        "description": "Explore live music venues, concerts, festivals, open mics, jam sessions, and gigs across the Netherlands."
      }
    });
  }

}
