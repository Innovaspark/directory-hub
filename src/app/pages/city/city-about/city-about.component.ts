// city-about.component.ts
import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {VenueStateService} from "@core/state/venue-state.service";
import {City, CityPhoto} from '@core/models/city.model';
import {NavigationService} from '@services/navigation.service';
import {LocationStateService} from '@core/state/location-state.service';

@Component({
  selector: 'app-city-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './city-about.component.html',
  styleUrl: './city-about.component.scss'
})
export class CityAboutComponent {
  venueState = inject(VenueStateService);
  navigationService = inject(NavigationService);
  locationService = inject(LocationStateService);

  $currentCity = this.venueState.$currentCity;

  getPhotos(): CityPhoto[] {
    const city = this.$currentCity();
    if (!city?.photos) return [];

    try {
      return typeof city.photos === 'string' ? JSON.parse(city.photos) : city.photos;
    } catch (e) {
      console.error('Error parsing photos:', e);
      return [];
    }
  }

  navigateToExplore() {
    const countryCode = this.venueState.$countryCode();
    const citySlug = this.venueState.$citySlug();
    debugger;
    this.navigationService.navigateToVenues(countryCode, citySlug);
  }
}
