import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, ExpandHeader, FooterComponent],
  templateUrl: './directory-layout.component.html'
})
export class DirectoryLayoutComponent {

  constructor(private route: ActivatedRoute, private router: Router) {
    // This works in SSR
    console.log('Route params:', this.route.snapshot.params);
    console.log('Route data:', this.route.snapshot.data);
  }

  ngOnInit() {
    console.log('Current URL:', this.router.url);
    console.log('Route tree:', this.router.routerState.root);
  }
}
