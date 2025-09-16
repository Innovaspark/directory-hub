import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";
import {HeaderComponent} from '@components/header/header.component';

@Component({
  selector: 'app-directory-layout',
  imports: [RouterOutlet, ExpandHeader, FooterComponent],
  template: `

    <div class="page-container">
      <header class="header">
        <app-expand-header></app-expand-header>
      </header>

      <main class="main-content">
        <div class="content-wrapper">

          <router-outlet></router-outlet>

        </div>
      </main>

      <div class="footer">
        <app-footer></app-footer>
      </div>
    </div>

  `
})
export class DirectoryLayoutComponent {

}
