import {Component, input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Venue} from "@core/models/venue.model";

@Component({
  selector: 'app-venue-list',
  imports: [CommonModule],
  templateUrl: './venue-list.component.html'
})
export class VenueListComponent {

  defaultVenueImage = 'https://images.unsplash.com/photo-1543261876-1a37d08f7b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMzIzMzB8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjB2ZW51ZXN8ZW58MHwyfHx8MTc1NjkxODM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&w=450';

  $venues = input<Array<Venue>>([])

  onImageError(event: any) {
    event.target.src = this.defaultVenueImage;
  }

}
