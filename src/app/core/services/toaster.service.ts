// services/toast.service.ts
import { Injectable, ComponentRef, ViewContainerRef, inject, createComponent, EnvironmentInjector, ApplicationRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  // private document = inject(DOCUMENT);
  // private appRef = inject(ApplicationRef);
  // private injector = inject(EnvironmentInjector);
  // private platformId = inject(PLATFORM_ID);
  //
  // private toasts: Toast[] = [];
  // private containerElement: HTMLElement | null = null;
  //
  // private isBrowser(): boolean {
  //   return typeof window !== 'undefined' && typeof document !== 'undefined' && !!document.body;
  // }
  //
  // private ensureContainer(): HTMLElement {
  //   if (!this.isBrowser()) {
  //     return this.document.createElement('div'); // Return dummy element for SSR
  //   }
  //
  //   if (!this.containerElement) {
  //     this.containerElement = this.document.createElement('div');
  //     this.containerElement.className = 'toast-container';
  //     this.containerElement.style.cssText = `
  //       position: fixed;
  //       top: 20px;
  //       right: 20px;
  //       z-index: 9999;
  //       display: flex;
  //       flex-direction: column;
  //       gap: 8px;
  //       max-width: 400px;
  //       pointer-events: none;
  //     `;
  //     this.document.body.appendChild(this.containerElement);
  //   }
  //   return this.containerElement;
  // }
  //
  // private createToastElement(toast: Toast): HTMLElement {
  //   const toastEl = this.document.createElement('div');
  //   toastEl.className = `toast toast-${toast.type}`;
  //   toastEl.style.cssText = `
  //     background: white;
  //     border-radius: 8px;
  //     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  //     border-left: 4px solid;
  //     animation: slideIn 0.3s ease-out;
  //     cursor: pointer;
  //     transition: transform 0.2s ease;
  //     pointer-events: auto;
  //     margin-bottom: 8px;
  //   `;
  //
  //   // Type-specific styling
  //   const colors = {
  //     success: '#10b981',
  //     error: '#ef4444',
  //     warning: '#f59e0b',
  //     info: '#3b82f6'
  //   };
  //   toastEl.style.borderLeftColor = colors[toast.type];
  //
  //   // Icons
  //   const icons = {
  //     success: '✓',
  //     error: '✕',
  //     warning: '⚠',
  //     info: 'ℹ'
  //   };
  //
  //   toastEl.innerHTML = `
  //     <div style="display: flex; align-items: center; padding: 12px 16px; gap: 12px;">
  //       <div style="font-size: 18px; font-weight: bold; flex-shrink: 0; color: ${colors[toast.type]};">
  //         ${icons[toast.type]}
  //       </div>
  //       <div style="flex: 1; font-size: 14px; line-height: 1.4;">
  //         ${toast.message}
  //       </div>
  //       <button style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
  //         ×
  //       </button>
  //     </div>
  //   `;
  //
  //   // Add hover effect
  //   toastEl.addEventListener('mouseenter', () => {
  //     toastEl.style.transform = 'translateX(-4px)';
  //   });
  //   toastEl.addEventListener('mouseleave', () => {
  //     toastEl.style.transform = 'translateX(0)';
  //   });
  //
  //   // Click to dismiss
  //   toastEl.addEventListener('click', () => {
  //     this.dismissToast(toastEl, toast.id);
  //   });
  //
  //   return toastEl;
  // }
  //
  // private dismissToast(element: HTMLElement, id: string): void {
  //   // Remove from array
  //   this.toasts = this.toasts.filter(t => t.id !== id);
  //
  //   // Animate out
  //   element.style.animation = 'slideOut 0.3s ease-out forwards';
  //
  //   setTimeout(() => {
  //     if (element.parentNode) {
  //       element.parentNode.removeChild(element);
  //     }
  //
  //     // Clean up container if no toasts left
  //     if (this.toasts.length === 0 && this.containerElement) {
  //       this.document.body.removeChild(this.containerElement);
  //       this.containerElement = null;
  //     }
  //   }, 300);
  // }
  //
  // private addToast(toast: Omit<Toast, 'id'>): void {
  //   if (!this.isBrowser()) {
  //     return; // Skip during SSR
  //   }
  //
  //   // Double-check we have a real browser document
  //   if (!this.document.body || typeof this.document.createElement !== 'function') {
  //     return;
  //   }
  //
  //   const newToast: Toast = {
  //     ...toast,
  //     id: Math.random().toString(36).substring(2) + Date.now().toString(36),
  //     duration: toast.duration ?? 4000
  //   };
  //
  //   this.toasts.push(newToast);
  //
  //   const container = this.ensureContainer();
  //   const toastElement = this.createToastElement(newToast);
  //
  //   // Add animations to head if not already there
  //   this.ensureAnimations();
  //
  //   container.appendChild(toastElement);
  //
  //   // Auto-dismiss
  //   if (newToast.duration && newToast.duration > 0) {
  //     setTimeout(() => {
  //       this.dismissToast(toastElement, newToast.id);
  //     }, newToast.duration);
  //   }
  // }
  //
  // private ensureAnimations(): void {
  //   if (!this.document.getElementById('toast-animations')) {
  //     const style = this.document.createElement('style');
  //     style.id = 'toast-animations';
  //     style.textContent = `
  //       @keyframes slideIn {
  //         from {
  //           transform: translateX(100%);
  //           opacity: 0;
  //         }
  //         to {
  //           transform: translateX(0);
  //           opacity: 1;
  //         }
  //       }
  //       @keyframes slideOut {
  //         from {
  //           transform: translateX(0);
  //           opacity: 1;
  //         }
  //         to {
  //           transform: translateX(100%);
  //           opacity: 0;
  //         }
  //       }
  //       @media (max-width: 480px) {
  //         .toast-container {
  //           left: 20px !important;
  //           right: 20px !important;
  //           max-width: none !important;
  //         }
  //       }
  //     `;
  //     this.document.head.appendChild(style);
  //   }
  // }
  //
  // success(message: string, duration?: number): void {
  //   this.addToast({ type: 'success', message, duration });
  // }
  //
  // error(message: string, duration?: number): void {
  //   this.addToast({ type: 'error', message, duration });
  // }
  //
  // warning(message: string, duration?: number): void {
  //   this.addToast({ type: 'warning', message, duration });
  // }
  //
  // info(message: string, duration?: number): void {
  //   this.addToast({ type: 'info', message, duration });
  // }
  //
  // clear(): void {
  //   this.toasts.forEach(toast => {
  //     const elements = this.containerElement?.querySelectorAll('.toast');
  //     elements?.forEach(el => {
  //       this.dismissToast(el as HTMLElement, toast.id);
  //     });
  //   });
  // }


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
