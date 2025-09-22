import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {

  constructor(private deviceService: DeviceDetectorService) {}

  isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }

  // Debug method to see what's happening
  // debug(): void {
  //   console.log('=== DEVICE DETECTION DEBUG ===');
  //   console.log('User Agent:', navigator.userAgent);
  //   console.log('Library results:');
  //   console.log('- isMobile():', this.deviceService.isMobile());
  //   console.log('- isTablet():', this.deviceService.isTablet());
  //   console.log('- isDesktop():', this.deviceService.isDesktop());
  //
  //   const deviceInfo = this.deviceService.getDeviceInfo();
  //   console.log('Full device info:', deviceInfo);
  //   console.log('Device type from info:', deviceInfo.deviceType);
  //   console.log('OS:', deviceInfo.os);
  //   console.log('Browser:', deviceInfo.browser);
  // }

}
