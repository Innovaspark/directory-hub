// admin-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AdminSidebarComponent} from '../../shared/components/admin-sidebar/admin-sidebar';
import {AdminHeaderComponent} from '../../shared/components/admin-header/admin-header';
import {DrawerComponent} from '../../shared/components/drawer/drawer';
import {SidebarMenuComponent} from '../../shared/components/sidebar-menu/sidebar-menu';
import {ExpandHeader} from '@components/expand-header/expand-header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent, DrawerComponent, SidebarMenuComponent, ExpandHeader],
  templateUrl: './admin-dashboard.component.html'
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
