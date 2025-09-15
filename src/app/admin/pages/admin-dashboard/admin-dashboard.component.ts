// admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AdminSidebarComponent} from '../../shared/components/admin-sidebar/admin-sidebar';
import {AdminHeaderComponent} from '../../shared/components/admin-header/admin-header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent, AdminHeaderComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <app-admin-sidebar
        [isExpanded]="sidebarExpanded"
        [isMobileOpen]="mobileSidebarOpen"
        (toggleExpanded)="toggleSidebar()"
        (closeMobile)="closeMobileSidebar()">
      </app-admin-sidebar>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Header -->
        <app-admin-header
          [pageTitle]="currentPageTitle"
          [pageSubtitle]="currentPageSubtitle"
          (toggleMobile)="openMobileSidebar()">
        </app-admin-header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  sidebarExpanded = true;
  mobileSidebarOpen = false;
  currentPageTitle = 'Dashboard';
  currentPageSubtitle = "Welcome back! Here's what's happening.";

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  openMobileSidebar(): void {
    this.mobileSidebarOpen = true;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

  // You can call this method when route changes to update page title
  updatePageTitle(title: string, subtitle?: string): void {
    this.currentPageTitle = title;
    this.currentPageSubtitle = subtitle || "Manage your directory data";
  }
}
