// city-about.component.ts
import {Component, inject, Signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {VenueStateService} from "@core/state/venue-state.service";
import {City, CityPhoto} from '@core/models/city.model';

@Component({
  selector: 'app-city-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './city-about.component.html',
  styleUrl: './city-about.component.scss'
})
export class CityAboutComponent {
  venueState = inject(VenueStateService);
  $currentCity = this.venueState.$currentCity;

  // Computed properties for photos
  $primaryPhoto = computed(() => {
    const city = this.$currentCity()();
    return city?.photos?.find((photo: CityPhoto) => photo.primary) || null;
  });

  $secondaryPhotos = computed(() => {
    const city = this.$currentCity()();
    return city?.photos?.filter((photo: CityPhoto) => !photo.primary) || [];
  });

  // City stats for display
  getCityStats() {
    const city = this.$currentCity()();  // Call the signal!
    return {
      venueCount: city?.venueCount ?? 0,
      timezone: city?.timezone ?? 'Europe/Amsterdam',
      country: city?.country?.name ?? 'Netherlands'
    };
  }
}
