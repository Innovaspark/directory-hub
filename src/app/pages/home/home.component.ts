// home.component.ts
import { Component } from '@angular/core';
import {FeaturedVenuesComponent} from "@components/featured-venues/featured-venues";
import {HeroSectionComponent} from "@components/hero-section/hero-section";
import {PopularCountriesComponent} from "@components/popular-countries/popular-countries";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, PopularCountriesComponent],
  template: `
      <div class="home">
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
