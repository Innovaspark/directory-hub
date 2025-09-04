import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  templateUrl: './directory-layout.component.html'
})
export class DirectoryLayoutComponent {

}
