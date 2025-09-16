// tenant-table.component.ts (updated to use TenantService)
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '@components/generic-table/generic-table.component';
import { Tenant, VenueType } from '@core/models/tenant.model';
import { TableColumn, TableConfig } from '@components/generic-table/types';
import { TenantService, PaginatedTenantsResponse } from '@services/tenant.service';

@Component({
  selector: 'app-tenant-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <app-generic-table
      [data]="data()"
      [columns]="columns"
      [config]="tableConfig">
    </app-generic-table>
  `
})
export class TenantTableComponent implements OnInit {
  data = signal<Tenant[]>([]);
  loading = signal<boolean>(false);

  constructor(private tenantService: TenantService) {}

  tableConfig: TableConfig = {
    title: 'Tenant Management',
    searchPlaceholder: 'Search tenants...',
  };

  // Simplified column definitions - mostly just display raw values
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
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => `
        <div class="action-buttons">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-delete">Delete</button>
        </div>
      `
    }
  ];

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.loading.set(true);

    // For now, just load first page with default page size
    this.tenantService.getAllTenants(1, 10).subscribe({
      next: (response: PaginatedTenantsResponse) => {
        this.data.set(response.tenants);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.data.set([]);
        this.loading.set(false);
      }
    });
  }
}
