// services/toast.service.ts
import { Injectable, ComponentRef, ViewContainerRef, inject, createComponent, EnvironmentInjector, ApplicationRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private platformId = inject(PLATFORM_ID);
  private toastr = inject(ToastrService);

  showSuccess(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.success(message);
    }
  }

  showError(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.toastr.error(message);
    }
  }

}
