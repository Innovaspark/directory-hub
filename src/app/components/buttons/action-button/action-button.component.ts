import {Component, input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-action-button',
  imports: [RouterLink],
  templateUrl: './action-button.component.html'
})
export class ActionButtonComponent {

  caption = input<string>('');
  routerLink = input<string>('');

}
