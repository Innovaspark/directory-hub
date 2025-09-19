// sidebar-menu.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="p-4">
      <div *ngFor="let item of menuItems" class="mb-1">

        <!-- Top Level Item -->
        <div class="flex items-center justify-between">
          <a *ngIf="!item.children; else expandableItem"
             [routerLink]="item.path"
             routerLinkActive="bg-blue-100 text-blue-700 border-r-2 border-blue-700"
             class="flex items-center w-full px-3 py-2 text-gray-700 rounded-l hover:bg-gray-100 transition-colors">
            <svg *ngIf="item.icon" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(item.icon)"></path>
            </svg>
            <span>{{ item.label }}</span>
          </a>

          <!-- Expandable Item -->
          <ng-template #expandableItem>
            <button (click)="toggleSubmenu(item)"
                    class="flex items-center justify-between w-full px-3 py-2 text-gray-700 rounded hover:bg-gray-100 transition-colors">
              <div class="flex items-center">
                <svg *ngIf="item.icon" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(item.icon)"></path>
                </svg>
                <span>{{ item.label }}</span>
              </div>
              <svg class="w-4 h-4 transition-transform"
                   [class.rotate-90]="item.expanded"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </ng-template>
        </div>

        <!-- Submenu Items -->
        <div *ngIf="item.children && item.expanded"
             class="ml-6 mt-1 border-l-2 border-gray-200 pl-4">
          <a *ngFor="let child of item.children"
             [routerLink]="child.path"
             routerLinkActive="bg-blue-50 text-blue-600 border-r-2 border-blue-600"
             class="flex items-center px-3 py-2 text-sm text-gray-600 rounded-l hover:bg-gray-50 hover:text-gray-800 transition-colors mb-1">
            <svg *ngIf="child.icon" class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(child.icon)"></path>
            </svg>
            <span>{{ child.label }}</span>
          </a>
        </div>
      </div>
    </nav>
  `
})
export class SidebarMenuComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      path: './',
      icon: 'home'
    },
    {
      label: 'Tenants',
      path: 'tenants',
      icon: 'building'
    },
    {
      label: 'Countries',
      path: 'countries',
      icon: 'map'
    },
    {
      label: 'Venues',
      icon: 'building',
      children: [
        { label: 'All Venues', path: '/nl/all/venues', icon: 'list' },
        { label: 'Amersfoort', path: '/nl/amersfoort/venues', icon: 'plus' },
      ]
    },
    // {
    //   label: 'Users',
    //   icon: 'users',
    //   children: [
    //     { label: 'All Users', path: '/users', icon: 'list' },
    //     { label: 'Add User', path: '/users/add', icon: 'plus' },
    //     { label: 'Roles', path: '/users/roles', icon: 'shield' }
    //   ]
    // },
    // {
    //   label: 'Analytics',
    //   path: '/analytics',
    //   icon: 'chart'
    // },
    // {
    //   label: 'Settings',
    //   path: '/settings',
    //   icon: 'settings'
    // }
  ];

  toggleSubmenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }

  getIconPath(iconName: string): string {
    const icons: Record<string, string> = {
      'home': 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
      'building': 'M3 21h18M5 21V7l8-4v18M19 21V11l-6-4',
      'users': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M22 21v-2a4 4 0 0 0-3-3.87',
      'chart': 'M3 3v18h18 M8 12l4-4 4 4 6-6',
      'settings': 'M12.22 2h-.44a2 2 0 0 0-2 2.18l.2 1.83a2 2 0 0 1-.26 1.31l-1.3.75a2 2 0 0 1-2.4-.22l-1.3-1.3a2 2 0 0 0-2.83 0l-.31.31a2 2 0 0 0 0 2.83l1.3 1.3a2 2 0 0 1 .22 2.4l-.75 1.3a2 2 0 0 1-1.31.26l-1.83-.2a2 2 0 0 0-2.18 2v.44a2 2 0 0 0 2.18 2l1.83.2a2 2 0 0 1 1.31.26l.75 1.3a2 2 0 0 1-.22 2.4l-1.3 1.3a2 2 0 0 0 0 2.83l.31.31a2 2 0 0 0 2.83 0l1.3-1.3a2 2 0 0 1 2.4-.22l1.3.75a2 2 0 0 1 .26 1.31l.2 1.83a2 2 0 0 0 2 2.18h.44a2 2 0 0 0 2-2.18l-.2-1.83a2 2 0 0 1 .26-1.31l1.3-.75a2 2 0 0 1 2.4.22l1.3 1.3a2 2 0 0 0 2.83 0l.31-.31a2 2 0 0 0 0-2.83l-1.3-1.3a2 2 0 0 1-.22-2.4l.75-1.3a2 2 0 0 1 1.31-.26l1.83.2a2 2 0 0 0 2.18-2v-.44a2 2 0 0 0-2.18-2l-1.83-.2a2 2 0 0 1-1.31-.26l-.75-1.3a2 2 0 0 1 .22-2.4l1.3-1.3a2 2 0 0 0 0-2.83l-.31-.31a2 2 0 0 0-2.83 0l-1.3 1.3a2 2 0 0 1-2.4.22l-1.3-.75a2 2 0 0 1-.26-1.31l-.2-1.83a2 2 0 0 0-2-2.18Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      'list': 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
      'plus': 'M5 12h14 M12 5v14',
      'tag': 'm15 5 4 4-7 7-4-4 7-7z M9 7 4 2l-1 1 2 5z',
      'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
    };
    return icons[iconName] || '';
  }
}
