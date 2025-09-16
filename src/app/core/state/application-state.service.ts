// services/app-state.service.ts
import { Injectable, signal } from '@angular/core';
import { Tenant } from '@core/models/tenant.model';
import {TenantService} from "@core/services/tenant.service";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // Private writable signal for tenant
  private _tenant = signal<Tenant | null>(null);

  // Public readonly signal for tenant
  readonly $tenant = this._tenant.asReadonly();

  constructor(private tenantService: TenantService) {}

  // Initialize tenant data
  initializeTenant(): void {
    this.tenantService.getCurrentTenant().subscribe({
      next: (tenant) => {
        // console.log('tenant: ', tenant);
        this.setTenant(tenant)
      },
      error: (error) => {
        console.error('Failed to load tenant:', error);
        this.setTenant(null);
      }
    });
  }

  // Method to update tenant
  setTenant(tenant: Tenant | null): void {
    this._tenant.set(tenant);
  }

  // Method to clear tenant
  clearTenant(): void {
    this._tenant.set(null);
  }

  // Utility method to check if tenant is loaded
  isTenantLoaded(): boolean {
    return this.$tenant() !== null;
  }
}
