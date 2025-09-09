// home.component.ts
import { Component } from '@angular/core';
import {FeaturedVenuesComponent} from "@components/featured-venues/featured-venues";
import {HeroSectionComponent} from "@components/hero-section/hero-section";
import {PopularCountriesComponent} from "@components/popular-countries/popular-countries";
import {Search} from "@components/search/search";
import {SearchBarComponent} from "@components/search-bar/search-bar";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, PopularCountriesComponent, Search, SearchBarComponent],
  template: `
      <div class="home">
          <app-search-bar></app-search-bar>
          <app-hero-section></app-hero-section>
          <app-popular-countries></app-popular-countries>
      </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
    }
  `]
})
export class HomeComponent {
}
