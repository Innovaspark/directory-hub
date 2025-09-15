import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";
import {HeaderComponent} from '@components/header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, ExpandHeader, FooterComponent, HeaderComponent],
  templateUrl: './directory-layout.component.html'
})
export class DirectoryLayoutComponent {

}
