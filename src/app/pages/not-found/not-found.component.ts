import {Component, inject} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import {NavigationService} from "@core/services/navigation.service";

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

  private navigationService = inject(NavigationService);

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  navigateToExplore() {
    this.navigationService.navigateToVenues('nl');
  }

}
