// tenant-table.component.ts (refactored to use generic table)
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenericTableComponent} from '@components/generic-table/generic-table.component';
import {Tenant, VenueType} from '@core/models/tenant.model';
import {TableColumn, TableConfig} from '@components/generic-table/types';

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

  // Same table config as before
  tableConfig: TableConfig = {
    title: 'Tenant Management',
    searchPlaceholder: 'Search tenants...',
  };

  // Same column definitions as before - no changes
  columns: TableColumn<Tenant>[] = [
    {
      accessorKey: 'name' as keyof Tenant,
      header: 'Name',
      cell: (info: any) => `
        <div>
          <div class="tenant-name">${info.getValue()}</div>
          <div class="tenant-slug">${info.row.original.slug}</div>
        </div>
      `
    },
    {
      accessorKey: 'description' as keyof Tenant,
      header: 'Description',
      cell: (info: any) => info.getValue() || '-'
    },
    {
      accessorKey: 'domain_names' as keyof Tenant,
      header: 'Domains',
      cell: (info: any) => {
        const domains = info.getValue() as string[];
        return `
          <div class="domain-list">
            ${domains.map(domain => `<span class="tag">${domain}</span>`).join('')}
          </div>
        `;
      }
    },
    {
      accessorKey: 'venue_types' as keyof Tenant,
      header: 'Venue Types',
      cell: (info: any) => {
        const types = info.getValue() as VenueType[];
        return `
          <div class="venue-types">
            ${types.map(type => `
              <span class="venue-type-chip" style="background-color: ${type.color}20; color: ${type.color};">
                ${type.icon} ${type.label}
              </span>
            `).join('')}
          </div>
        `;
      }
    },
    {
      accessorKey: 'keywords' as keyof Tenant,
      header: 'Keywords',
      cell: (info: any) => {
        const keywords = info.getValue() as string[];
        return `
          <div class="keywords-list">
            ${keywords.slice(0, 3).map(keyword => `<span class="tag">${keyword}</span>`).join('')}
            ${keywords.length > 3 ? `<span class="tag">+${keywords.length - 3}</span>` : ''}
          </div>
        `;
      }
    },
    {
      accessorKey: 'updated_at' as keyof Tenant,
      header: 'Last Updated',
      cell: (info: any) => `
        <div class="date-cell">
          ${new Date(info.getValue() as string).toLocaleDateString()}
        </div>
      `
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

  // Same sample data as before
  private sampleData: Tenant[] = [
    {
      id: '1',
      name: 'Amsterdam Music Hub',
      slug: 'amsterdam-music',
      description: 'Live music venues in Amsterdam',
      domain_names: ['amsterdam-music.com', 'music-amsterdam.nl'],
      search_terms: ['live music', 'concerts', 'venues'],
      keywords: ['jazz', 'rock', 'electronic'],
      venue_types: [
        { slug: 'bar', label: 'Bar', icon: '🍺', color: '#f39c12', description: 'Bars with live music' },
        { slug: 'club', label: 'Club', icon: '🎵', color: '#9b59b6', description: 'Music clubs' }
      ],
      settings: { timezone: 'Europe/Amsterdam' },
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-03-20T14:45:00Z'
    },
    {
      id: '2',
      name: 'Berlin Underground',
      slug: 'berlin-underground',
      description: 'Underground music scene in Berlin',
      domain_names: ['berlin-underground.de'],
      search_terms: ['underground', 'techno', 'clubs'],
      keywords: ['techno', 'house', 'minimal'],
      venue_types: [
        { slug: 'club', label: 'Club', icon: '🎵', color: '#9b59b6', description: 'Music clubs' },
        { slug: 'warehouse', label: 'Warehouse', icon: '🏭', color: '#34495e', description: 'Warehouse venues' }
      ],
      settings: { timezone: 'Europe/Berlin', currency: 'EUR' },
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-03-18T11:20:00Z'
    }
  ];

  ngOnInit() {
    // Load sample data - same as before
    this.data.set(this.sampleData);
  }
}
