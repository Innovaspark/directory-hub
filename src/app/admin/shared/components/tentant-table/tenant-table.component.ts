// tenant-table.component.ts (updated to use TenantService)
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenericTableComponent } from '@components/generic-table/generic-table.component';
import { Tenant, VenueType } from '@core/models/tenant.model';
import { TableColumn, TableConfig, TableAction } from '@components/generic-table/types';
import { TenantService, PaginatedTenantsResponse } from '@services/tenant.service';

@Component({
  selector: 'app-tenant-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <app-generic-table
      [data]="data()"
      [columns]="columns"
      [config]="tableConfig"
      [totalCount]="totalCount()"
      [currentPage]="currentPage()"
      [pageSize]="pageSize()"
      [loading]="loading()"
      (pageChanged)="onPageChange($event)"
      (actionTriggered)="onActionTriggered($event)">
    </app-generic-table>
  `
})
export class TenantTableComponent implements OnInit {
  data = signal<Tenant[]>([]);
  totalCount = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  tableConfig: TableConfig = {
    title: 'Tenant Management',
    searchPlaceholder: 'Search tenants...',
  };

  // Simplified column definitions - no actions column needed
  columns: TableColumn<Tenant>[] = [
    {
      accessorKey: 'name' as keyof Tenant,
      header: 'Name'
    },
    {
      accessorKey: 'slug' as keyof Tenant,
      header: 'Slug'
    },
    {
      accessorKey: 'description' as keyof Tenant,
      header: 'Description',
      cell: (info: any) => info.getValue() || '-'
    },
    {
      accessorKey: 'domain_names' as keyof Tenant,
      header: 'Domains'
    },
    {
      accessorKey: 'venue_types' as keyof Tenant,
      header: 'Venue Types',
      cell: (info: any) => {
        const types = info.getValue() as VenueType[];
        if (!types || !Array.isArray(types)) {
          return '-';
        }
        return `
          <div class="venue-types">
            ${types.map(type => `
              <span class="venue-type-chip" style="background-color: ${type.color}20; color: ${type.color};">
                <i class="fas fa-${type.icon}"></i> ${type.label}
              </span>
            `).join('')}
          </div>
        `;
      }
    },
    {
      accessorKey: 'keywords' as keyof Tenant,
      header: 'Keywords'
    },
    {
      accessorKey: 'updated_at' as keyof Tenant,
      header: 'Last Updated',
      cell: (info: any) => new Date(info.getValue() as string).toLocaleDateString()
    }
  ];

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.loading.set(true);

    this.tenantService.getAllTenants(this.currentPage(), this.pageSize()).subscribe({
      next: (response: PaginatedTenantsResponse) => {
        this.data.set(response.tenants);
        this.totalCount.set(response.totalCount);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.data.set([]);
        this.totalCount.set(0);
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadTenants();
  }

  onActionTriggered(event: {action: string, data: Tenant}) {
    const { action, data } = event;

    switch (action) {
      case 'edit':
        this.editTenant(data);
        break;
      case 'delete':
        this.deleteTenant(data);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  private editTenant(tenant: Tenant) {
    // Navigate to edit page
    this.router.navigate(['/admin/tenants', tenant.id, 'edit']);
  }

  private deleteTenant(tenant: Tenant) {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`)) {
      // TODO: Implement actual delete via service
      console.log('Deleting tenant:', tenant);

      // For now, just reload the data
      // Later: call tenantService.deleteTenant(tenant.id) then reload
      this.loadTenants();
    }
  }
}
