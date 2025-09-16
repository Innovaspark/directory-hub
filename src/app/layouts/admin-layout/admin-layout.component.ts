import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";
import {HeaderComponent} from '@components/header/header.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, ExpandHeader],
  template: `
    <div class="bg-gray-50">

        <router-outlet></router-outlet>

    </div>
  `
})
export class AdminLayoutComponent {

}
