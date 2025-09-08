// country-landing-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryHeroComponent } from '@components/country-hero/country-hero';
import {CountryCitiesComponent} from "@components/country-cities/country-cities";

@Component({
  selector: 'app-country-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    CountryHeroComponent,
    CountryCitiesComponent
  ],
  template: `
    <div class="country-landing">
      <app-country-hero></app-country-hero>
        <app-country-cities></app-country-cities>
    </div>
  `,
  styles: [`
    .country-landing {
      min-height: 100vh;
    }
  `]
})
export class CountryLandingPageComponent {
  // This component is just a container - all logic is in child components
}
