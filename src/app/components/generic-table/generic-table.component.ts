// generic-table.component.ts (simplified without generics)
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
export class GenericTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn<any>[] = [];
  @Input() config: Partial<TableConfig> = {};
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  // Server-side pagination inputs
  @Input() totalCount?: number;
  @Input() currentPage?: number;
  @Input() pageSize?: number;

  @Output() rowClick = new EventEmitter<any>();
  @Output() rowAction = new EventEmitter<TableAction<any>>();
  @Output() actionTriggered = new EventEmitter<{action: string, data: any}>();
  @Output() pageChanged = new EventEmitter<number>();

  // Internal signals for reactivity
  private dataSignal = signal<any[]>([]);
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

    // Handle server-side vs client-side pagination
    if (this.tableConfig.showPagination) {
      if (this.isServerSidePagination()) {
        options.manualPagination = true;
        options.pageCount = this.getTotalPages();
      } else {
        options.getPaginationRowModel = getPaginationRowModel();
      }
    }

    return options;
  });

  ngOnInit() {
    debugger;
    this.updateConfig();
    this.dataSignal.set(this.data);

    // Always add actions column
    this.columns.push({
      id: 'actions',
      header: 'Actions',
      cell: () => '' // Template handles this
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSignal.set(this.data);
    }
    if (changes['config']) {
      this.updateConfig();
    }
    if (changes['currentPage'] || changes['pageSize'] || changes['totalCount']) {
      this.updatePaginationState();
    }
  }

  private updateConfig() {
    this.tableConfig = { ...DEFAULT_TABLE_CONFIG, ...this.config };
  }

  isServerSidePagination(): boolean {
    return this.totalCount !== undefined;
  }

  getEffectivePageSize(): number {
    return this.pageSize || this.tableConfig.pageSize || 10;
  }

  private getTotalPages(): number {
    if (!this.totalCount) return 0;
    return Math.ceil(this.totalCount / this.getEffectivePageSize());
  }

  private updatePaginationState() {
    if (this.isServerSidePagination() && this.currentPage !== undefined) {
      this.table.setPageIndex(this.currentPage - 1);
    }
  }

  onPageChange(page: number) {
    if (this.isServerSidePagination()) {
      this.pageChanged.emit(page);
    } else {
      this.table.setPageIndex(page - 1);
    }
  }

  getCurrentPage(): number {
    if (this.isServerSidePagination()) {
      return this.currentPage || 1;
    }
    return this.table.getState().pagination.pageIndex + 1;
  }

  getTotalPagesCount(): number {
    if (this.isServerSidePagination()) {
      return this.getTotalPages();
    }
    return this.table.getPageCount();
  }

  getCanPreviousPage(): boolean {
    if (this.isServerSidePagination()) {
      return this.getCurrentPage() > 1;
    }
    return this.table.getCanPreviousPage();
  }

  getCanNextPage(): boolean {
    if (this.isServerSidePagination()) {
      return this.getCurrentPage() < this.getTotalPagesCount();
    }
    return this.table.getCanNextPage();
  }

  previousPage() {
    if (this.getCanPreviousPage()) {
      this.onPageChange(this.getCurrentPage() - 1);
    }
  }

  nextPage() {
    if (this.getCanNextPage()) {
      this.onPageChange(this.getCurrentPage() + 1);
    }
  }

  firstPage() {
    this.onPageChange(1);
  }

  lastPage() {
    this.onPageChange(this.getTotalPagesCount());
  }

  handleSort(column: any, event: Event) {
    event.preventDefault();
    if (this.tableConfig.sortable && column.getCanSort()) {
      column.toggleSorting();
    }
  }

  getCellValue(cell: any): string {
    const cellRenderer = cell.column.columnDef.cell;
    if (typeof cellRenderer === 'function') {
      return cellRenderer(cell.getContext());
    }
    return cell.getValue();
  }

  onRowClick(row: any, event: Event) {
    this.rowClick.emit(row.original);
  }

  onActionClick(action: string, data: any, event: Event) {
    event.stopPropagation();
    this.actionTriggered.emit({ action, data });
  }

  onAction(type: string, data: any, event?: Event) {
    event?.stopPropagation();
    this.rowAction.emit({ type, data, event });
  }

  // Helper for Math.min in template
  Math = Math;
}
