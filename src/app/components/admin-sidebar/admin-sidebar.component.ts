import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ActionButtonComponent} from "@components/buttons/action-button/action-button.component";

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, ActionButtonComponent],
  templateUrl: './admin-sidebar.component.html'
})
export class AdminSidebarComponent {
  @Output() mobileMenuClose = new EventEmitter<void>();

  // Create backup functionality
  createBackup(): void {
    // TODO: Implement backup creation
    console.log('Creating backup...');
    // Show success message or handle backup creation
  }

  // Clear cache functionality
  clearCache(): void {
    // TODO: Implement cache clearing
    console.log('Clearing cache...');
    // Show success message or handle cache clearing
  }

  // Close mobile menu
  closeMobileMenu(): void {
    this.mobileMenuClose.emit();
  }
}
