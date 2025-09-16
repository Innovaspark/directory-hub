import { Tenant, VenueType } from '@core/models/tenant.model';

// tenant-table.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  createAngularTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
} from '@tanstack/angular-table';

@Component({
  selector: 'app-tenant-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tenant-table.component.html',
  styleUrls: ['./tenant-table.component.scss']
})
export class TenantTableComponent implements OnInit {
  data = signal<Tenant[]>([]);
  globalFilter = signal('');

  // Sample data
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

  columns: ColumnDef<Tenant>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => `
        <div>
          <div class="tenant-name">${info.getValue()}</div>
          <div class="tenant-slug">${info.row.original.slug}</div>
        </div>
      `
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => info.getValue() || '-'
    },
    {
      accessorKey: 'domain_names',
      header: 'Domains',
      cell: (info) => {
        const domains = info.getValue() as string[];
        return `
          <div class="domain-list">
            ${domains.map(domain => `<span class="tag">${domain}</span>`).join('')}
          </div>
        `;
      }
    },
    {
      accessorKey: 'venue_types',
      header: 'Venue Types',
      cell: (info) => {
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
      accessorKey: 'keywords',
      header: 'Keywords',
      cell: (info) => {
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
      accessorKey: 'updated_at',
      header: 'Last Updated',
      cell: (info) => `
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

  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: this.globalFilter(),
    },
    onGlobalFilterChange: (updater) => {
      const value = typeof updater === 'function' ? updater(this.globalFilter()) : updater;
      this.globalFilter.set(value ?? '');
    },
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  }));

  ngOnInit() {
    // Load sample data
    this.data.set(this.sampleData);
  }

  // Helper method for sorting
  handleSort(column: any, event: Event) {
    event.preventDefault();
    if (column.getCanSort()) {
      column.toggleSorting();
    }
  }

  // Helper method to get cell value for rendering
  getCellValue(cell: any): string {
    const cellRenderer = cell.column.columnDef.cell;
    if (typeof cellRenderer === 'function') {
      return cellRenderer(cell.getContext());
    }
    return cell.getValue();
  }

  // Helper for Math.min in template
  Math = Math;
}
