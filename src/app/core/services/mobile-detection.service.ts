import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isMobile(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    // Primary check: actual mobile devices
    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (userAgentMobile) {
      return true;
    }

    // Chrome DevTools detection: Check if we're in device emulation mode
    // DevTools adds these properties when emulating mobile
    const isDevToolsEmulation = (
      // Check if touch events are artificially enabled
      'ontouchstart' in window &&
      // But we're still on a desktop user agent (Chrome/Safari/Firefox)
      /Chrome|Safari|Firefox/i.test(navigator.userAgent) &&
      // And viewport is mobile-sized
      window.innerWidth <= 768 &&
      // DevTools typically makes screen dimensions different from window
      (window.screen.width !== window.innerWidth || window.screen.height !== window.innerHeight)
    );

    return isDevToolsEmulation;
  }

  isTablet(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const userAgentTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

    if (userAgentTablet) {
      return true;
    }

    // DevTools tablet emulation
    const isTabletEmulation = (
      'ontouchstart' in window &&
      /Chrome|Safari|Firefox/i.test(navigator.userAgent) &&
      window.innerWidth > 768 && window.innerWidth <= 1024 &&
      (window.screen.width !== window.innerWidth || window.screen.height !== window.innerHeight)
    );

    return isTabletEmulation;
  }

  isPhone(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const userAgentPhone = /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (userAgentPhone) {
      return true;
    }

    // DevTools phone emulation (mobile that's not tablet)
    return this.isMobile() && !this.isTablet();
  }

  isDesktop(): boolean {
    return !this.isMobile();
  }
}

// Usage in any component:
//
// import { MobileDetectionService } from './services/mobile-detection.service';
//
// constructor(private mobileService: MobileDetectionService) {}
//
// ngOnInit() {
//   if (this.mobileService.isMobile()) {
//     // Mobile logic
//   }
// }
