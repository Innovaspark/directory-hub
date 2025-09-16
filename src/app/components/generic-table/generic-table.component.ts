// generic-table.component.ts (with server-side pagination)
import { Component, Input, Output, EventEmitter, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  createAngularTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/angular-table';
import { TableColumn, TableConfig, TableAction, DEFAULT_TABLE_CONFIG } from './types';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent<T = any> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() config: Partial<TableConfig> = {};
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  // NEW: Server-side pagination inputs
  @Input() totalCount?: number;
  @Input() currentPage?: number;
  @Input() pageSize?: number;

  @Output() rowClick = new EventEmitter<T>();
  @Output() rowAction = new EventEmitter<TableAction<T>>();

  // NEW: Server-side pagination output
  @Output() pageChanged = new EventEmitter<number>();

  // Internal signals for reactivity
  private dataSignal = signal<T[]>([]);
  globalFilter = signal('');

  // Merged configuration
  tableConfig: TableConfig = DEFAULT_TABLE_CONFIG;

  table = createAngularTable(() => {
    const options: any = {
      data: this.dataSignal(),
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
      state: {
        globalFilter: this.globalFilter(),
      },
      onGlobalFilterChange: (updater: any) => {
        if (this.tableConfig.filterable) {
          const value = typeof updater === 'function' ? updater(this.globalFilter()) : updater;
          this.globalFilter.set(value ?? '');
        }
      },
      globalFilterFn: 'includesString',
      initialState: {
        pagination: {
          pageSize: this.getEffectivePageSize(),
        },
      },
    };

    // Conditionally add features
    if (this.tableConfig.sortable) {
      options.getSortedRowModel = getSortedRowModel();
    }

    if (this.tableConfig.filterable) {
      options.getFilteredRowModel = getFilteredRowModel();
    }

    // NEW: Handle server-side vs client-side pagination
    if (this.tableConfig.showPagination) {
      if (this.isServerSidePagination()) {
        // Server-side pagination: don't use getPaginationRowModel
        options.manualPagination = true;
        options.pageCount = this.getTotalPages();
      } else {
        // Client-side pagination: use getPaginationRowModel
        options.getPaginationRowModel = getPaginationRowModel();
      }
    }

    return options;
  });

  ngOnInit() {
    this.updateConfig();
    this.dataSignal.set(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSignal.set(this.data);
    }
    if (changes['config']) {
      this.updateConfig();
    }
    // NEW: Update pagination when server-side pagination props change
    if (changes['currentPage'] || changes['pageSize'] || changes['totalCount']) {
      this.updatePaginationState();
    }
  }

  private updateConfig() {
    this.tableConfig = { ...DEFAULT_TABLE_CONFIG, ...this.config };
  }

  // NEW: Check if we're using server-side pagination
  private isServerSidePagination(): boolean {
    return this.totalCount !== undefined;
  }

  // NEW: Get effective page size (from input or config)
  private getEffectivePageSize(): number {
    return this.pageSize || this.tableConfig.pageSize || 10;
  }

  // NEW: Calculate total pages for server-side pagination
  private getTotalPages(): number {
    if (!this.totalCount) return 0;
    return Math.ceil(this.totalCount / this.getEffectivePageSize());
  }

  // NEW: Update pagination state for server-side pagination
  private updatePaginationState() {
    if (this.isServerSidePagination() && this.currentPage !== undefined) {
      // Update table's internal pagination state
      this.table.setPageIndex(this.currentPage - 1); // TanStack uses 0-based indexing
    }
  }

  // NEW: Handle page navigation for server-side pagination
  onPageChange(page: number) {
    if (this.isServerSidePagination()) {
      this.pageChanged.emit(page);
    } else {
      // Client-side pagination - let TanStack handle it
      this.table.setPageIndex(page - 1);
    }
  }

  // NEW: Get current page number (1-based)
  getCurrentPage(): number {
    if (this.isServerSidePagination()) {
      return this.currentPage || 1;
    }
    return this.table.getState().pagination.pageIndex + 1;
  }

  // NEW: Get total pages
  getTotalPagesCount(): number {
    if (this.isServerSidePagination()) {
      return this.getTotalPages();
    }
    return this.table.getPageCount();
  }

  // NEW: Check if can go to previous page
  getCanPreviousPage(): boolean {
    if (this.isServerSidePagination()) {
      return this.getCurrentPage() > 1;
    }
    return this.table.getCanPreviousPage();
  }

  // NEW: Check if can go to next page
  getCanNextPage(): boolean {
    if (this.isServerSidePagination()) {
      return this.getCurrentPage() < this.getTotalPagesCount();
    }
    return this.table.getCanNextPage();
  }

  // NEW: Go to previous page
  previousPage() {
    if (this.getCanPreviousPage()) {
      this.onPageChange(this.getCurrentPage() - 1);
    }
  }

  // NEW: Go to next page
  nextPage() {
    if (this.getCanNextPage()) {
      this.onPageChange(this.getCurrentPage() + 1);
    }
  }

  // NEW: Go to first page
  firstPage() {
    this.onPageChange(1);
  }

  // NEW: Go to last page
  lastPage() {
    this.onPageChange(this.getTotalPagesCount());
  }

  // Helper method for sorting
  handleSort(column: any, event: Event) {
    event.preventDefault();
    if (this.tableConfig.sortable && column.getCanSort()) {
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

  // Handle row clicks
  onRowClick(row: any, event: Event) {
    this.rowClick.emit(row.original);
  }

  // Handle action button clicks
  onAction(type: string, data: T, event?: Event) {
    event?.stopPropagation(); // Prevent row click when clicking actions
    this.rowAction.emit({ type, data, event });
  }

  // Helper for Math.min in template
  Math = Math;
}
