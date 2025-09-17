import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import {ToastService} from '@services/toaster.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {

  toast = inject(ToastService);

  constructor() {
    const platformId = inject(PLATFORM_ID);

    console.log('Browser?', isPlatformBrowser(platformId));
    console.log('Server?', isPlatformServer(platformId));
  }

  ngOnInit() {
    setTimeout(() => {
      this.toast.showSuccess('Test toast!');
    }, 1000);
  }

}
