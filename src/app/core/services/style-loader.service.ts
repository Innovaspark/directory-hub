import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StyleLoaderService {
  private linkId = 'bootstrap-css';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadBootstrap() {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById(this.linkId)) {
        const link = document.createElement('link');
        link.id = this.linkId;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
      }
    }
  }

  unloadBootstrap() {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(this.linkId);
      if (el) {
        el.remove();
      }
    }
  }
}
