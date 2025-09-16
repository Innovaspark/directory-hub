import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";
import {HeaderComponent} from '@components/header/header.component';

@Component({
  selector: 'app-directory-layout',
  imports: [RouterOutlet, ExpandHeader, FooterComponent],
  template: `
    <div class="bg-gray-50">

      <div class="py-2"></div>
      <div class="py-16">

        <app-expand-header></app-expand-header>

        <router-outlet></router-outlet>
      </div>

      <app-footer></app-footer>

    </div>
  `
})
export class DirectoryLayoutComponent {

}
