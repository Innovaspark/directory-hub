// home.component.ts
import {Component, inject} from '@angular/core';
import {FeaturedVenuesComponent} from "@components/featured-venues/featured-venues";
import {HeroSectionComponent} from "@components/hero-section/hero-section";
import {SearchBarComponent} from "@components/search-bar/search-bar";
import {SeoService} from "@core/services/seo.service";
import {environment} from "@environments/environment";
import {CountryCitiesComponent} from '@components/country-cities/country-cities';
import {CountriesComponent} from '../../admin/pages/countries/countries.component';
import {PopularCountriesComponent} from '@components/popular-countries/popular-countries';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, SearchBarComponent, FeaturedVenuesComponent, CountryCitiesComponent, CountriesComponent, PopularCountriesComponent],
  template: `
    <div class="home">
      <app-search-bar></app-search-bar>
      <app-hero-section></app-hero-section>
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
      url: '/', // current page path
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "GigaWhat",
          "url": environment.siteUrl,
          "description": "Explore live music venues, concerts, festivals, open mics, jam sessions, and gigs across the Netherlands.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${environment.siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@id": `${environment.siteUrl}/#organization`
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${environment.siteUrl}/#organization`,
          "name": "GigaWhat",
          "url": environment.siteUrl
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "url": environment.siteUrl,
          "name": "GigaWhat Homepage",
          "description": "Explore live music venues, concerts, festivals, open mics, jam sessions, and gigs across the Netherlands."
        }
      ]
    });
  }

}
