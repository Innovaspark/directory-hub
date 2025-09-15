// admin-sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Users, FileText, BarChart3, Settings, ChevronLeft, ChevronRight, X } from 'lucide-angular';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <!-- Mobile backdrop -->
    <div
      *ngIf="isMobileOpen"
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      (click)="closeMobile.emit()">
    </div>

    <!-- Sidebar -->
    <div [ngClass]="sidebarClasses">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div [ngClass]="headerContentClasses">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">D</span>
          </div>
          <span *ngIf="isExpanded" class="ml-3 font-semibold text-gray-900">Directory Admin</span>
        </div>

        <!-- Desktop toggle -->
        <button
          (click)="toggleExpanded.emit()"
          class="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <lucide-icon
            [img]="isExpanded ? ChevronLeftIcon : ChevronRightIcon"
            class="w-4 h-4">
          </lucide-icon>
        </button>

        <!-- Mobile close -->
        <button
          (click)="closeMobile.emit()"
          class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <button
          *ngFor="let item of menuItems"
          [routerLink]="item.path"
          routerLinkActive="bg-blue-50 text-blue-700 border border-blue-200"
          #rla="routerLinkActive"
          [ngClass]="getMenuItemClasses(rla.isActive)">
          <lucide-icon
            [img]="item.icon"
            class="w-5 h-5 flex-shrink-0"
            [ngClass]="{'text-blue-600': rla.isActive}">
          </lucide-icon>
          <span *ngIf="isExpanded" class="ml-3 transition-opacity duration-300">{{ item.label }}</span>
        </button>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200">
        <div [ngClass]="{'flex items-center': true, 'justify-center': !isExpanded}">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span class="text-gray-600 text-sm font-medium">JD</span>
          </div>
          <div *ngIf="isExpanded" class="ml-3 transition-opacity duration-300">
            <p class="text-sm font-medium text-gray-900">John Doe</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminSidebarComponent {
  @Input() isExpanded = true;
  @Input() isMobileOpen = false;
  @Output() toggleExpanded = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  // Lucide icons
  readonly HomeIcon = Home;
  readonly UsersIcon = Users;
  readonly FileTextIcon = FileText;
  readonly BarChart3Icon = BarChart3;
  readonly SettingsIcon = Settings;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly XIcon = X;

  menuItems: MenuItem[] = [
    { icon: this.HomeIcon, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: this.UsersIcon, label: 'Users', path: '/admin/users' },
    { icon: this.FileTextIcon, label: 'Venues', path: '/admin/venues' },
    { icon: this.BarChart3Icon, label: 'Analytics', path: '/admin/analytics' },
    { icon: this.SettingsIcon, label: 'Settings', path: '/admin/settings' },
  ];

  get sidebarClasses(): string[] {
    return [
      'fixed', 'inset-y-0', 'left-0', 'z-30', 'flex', 'flex-col',
      'bg-white', 'shadow-lg', 'transition-all', 'duration-300', 'ease-in-out',
      'lg:static', 'lg:translate-x-0',
      this.isMobileOpen ? 'translate-x-0' : '-translate-x-full',
      this.isExpanded ? 'w-64' : 'w-16'
    ];
  }

  get headerContentClasses(): string[] {
    return [
      'flex', 'items-center', 'transition-opacity', 'duration-300',
      this.isExpanded ? 'opacity-100' : 'opacity-0'
    ];
  }

  getMenuItemClasses(isActive: boolean): string[] {
    const baseClasses = [
      'w-full', 'flex', 'items-center', 'px-3', 'py-2.5', 'rounded-lg',
      'text-sm', 'font-medium', 'transition-all', 'duration-200'
    ];

    if (!this.isExpanded) {
      baseClasses.push('justify-center');
    }

    if (isActive) {
      baseClasses.push('bg-blue-50', 'text-blue-700', 'border', 'border-blue-200');
    } else {
      baseClasses.push('text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900');
    }

    return baseClasses;
  }
}
