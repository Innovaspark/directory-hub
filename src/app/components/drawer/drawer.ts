// simple-sidebar.component.ts
import {Component, input, model} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hamburger Button -->
    <button
      (click)="toggleSidebar()"
      class="button-hamburger">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- Backdrop -->
    <div
      *ngIf="isOpen()"
      (click)="closeSidebar()"
    >
    </div>

    <!-- Sidebar -->
    <div
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out"
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()">

      <!-- Sidebar Content -->
      <div class="drawer-content">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class DrawerComponent {
  isOpen = model<boolean>(true);

  toggleSidebar() {
    this.isOpen.set(!this.isOpen());
  }

  closeSidebar() {
    this.isOpen.set(false);
  }
}
