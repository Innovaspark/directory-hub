// admin-header.component.ts
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, Bell, Settings, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Mobile menu button -->
          <button
            (click)="toggleMobile.emit()"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <lucide-icon [img]="MenuIcon" class="w-5 h-5"></lucide-icon>
          </button>

          <div>
            <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
            <p class="text-sm text-gray-500">{{ pageSubtitle }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <lucide-icon [img]="BellIcon" class="w-5 h-5"></lucide-icon>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <!-- Settings -->
          <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <lucide-icon [img]="SettingsIcon" class="w-5 h-5"></lucide-icon>
          </button>

          <!-- User Menu -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">JD</span>
            </div>
            <button class="hidden sm:flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900">
              <span>John Doe</span>
              <lucide-icon [img]="ChevronDownIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class AdminHeaderComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle = "Welcome back! Here's what's happening.";
  @Output() toggleMobile = new EventEmitter<void>();

  // Lucide icons
  readonly MenuIcon = Menu;
  readonly BellIcon = Bell;
  readonly SettingsIcon = Settings;
  readonly ChevronDownIcon = ChevronDown;
}
