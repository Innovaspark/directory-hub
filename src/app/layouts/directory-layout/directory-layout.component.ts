import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, ExpandHeader],
  templateUrl: './directory-layout.component.html'
})
export class DirectoryLayoutComponent {

}
