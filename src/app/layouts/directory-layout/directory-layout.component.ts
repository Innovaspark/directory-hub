import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";
import {HeaderComponent} from '@components/header/header.component';
import {ScrollToTop} from '@components/scroll-to-top/scroll-to-top';
import {FloatingToolbarComponent} from '@components/floating-toolbar';

@Component({
  selector: 'app-directory-layout',
  imports: [RouterOutlet, ExpandHeader, FooterComponent, ScrollToTop],
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

    <app-scroll-to-top></app-scroll-to-top>

  `
})
export class DirectoryLayoutComponent {


}
