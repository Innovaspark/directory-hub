// generic-table.component.ts
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAngularTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/angular-table';
import { TableColumn, TableConfig, TableAction, DEFAULT_TABLE_CONFIG } from './types';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent {
  // ------------------ Inputs ------------------
  /** Table data; automatically updates table when changed */
  @Input() set data(rows: any[]) { this.dataSignal.set(rows ?? []); }

  /** Table columns; automatically updates merged columns when changed */
  @Input() set columns(cols: TableColumn<any>[]) { this.parentColumnsSignal.set(cols ?? []); }

  @Input() set config(cfg: Partial<TableConfig>) { this.updateConfig(cfg ?? {}); }

  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() totalCount?: number;
  @Input() currentPage?: number;
  @Input() pageSize?: number;

  /** Show action buttons in the table (default: true) */
  @Input() showActions: boolean = true;

  // ------------------ Outputs ------------------
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowAction = new EventEmitter<TableAction<any>>();
  @Output() actionTriggered = new EventEmitter<{ action: string, data: any }>();
  @Output() pageChanged = new EventEmitter<number>();

  // ------------------ Signals ------------------
  public dataSignal = signal<any[]>([]);
  private parentColumnsSignal = signal<TableColumn<any>[]>([]);
  public globalFilter = signal('');

  tableConfig: TableConfig = DEFAULT_TABLE_CONFIG;

  // Merge columns with optional actions column
  mergedColumns = computed(() => {
    const cols = this.parentColumnsSignal();
    if (!this.showActions) return cols;
    const hasActions = cols.some(c => c.id === 'actions');
    return hasActions
      ? cols
      : [...cols, { id: 'actions', header: 'Actions', cell: () => '' }];
  });

  // ------------------ Table ------------------
  table = createAngularTable(() => {
    const options: any = {
      data: this.dataSignal(),
      columns: this.mergedColumns(),
      getCoreRowModel: getCoreRowModel(),
      state: { globalFilter: this.globalFilter() },
      onGlobalFilterChange: (updater: any) => {
        if (this.tableConfig.filterable) {
          const value = typeof updater === 'function' ? updater(this.globalFilter()) : updater;
          this.globalFilter.set(value ?? '');
        }
      },
      globalFilterFn: 'includesString',
      initialState: {
        pagination: { pageSize: this.getEffectivePageSize() }
      }
    };

    if (this.tableConfig.sortable) options.getSortedRowModel = getSortedRowModel();
    if (this.tableConfig.filterable) options.getFilteredRowModel = getFilteredRowModel();
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

  // ------------------ Config ------------------
  private updateConfig(cfg: Partial<TableConfig>) {
    this.tableConfig = { ...DEFAULT_TABLE_CONFIG, ...cfg };
  }

  // ------------------ Pagination helpers ------------------
  isServerSidePagination(): boolean { return this.totalCount !== undefined; }
  getEffectivePageSize(): number { return this.pageSize || this.tableConfig.pageSize || 10; }

  private getTotalPages(): number {
    if (!this.totalCount) return 0;
    return Math.ceil(this.totalCount / this.getEffectivePageSize());
  }

  onPageChange(page: number) {
    if (this.isServerSidePagination()) this.pageChanged.emit(page);
    else this.table.setPageIndex(page - 1);
  }

  getCurrentPage(): number {
    if (this.isServerSidePagination()) return this.currentPage || 1;
    return this.table.getState().pagination.pageIndex + 1;
  }

  getTotalPagesCount(): number {
    if (this.isServerSidePagination()) return this.getTotalPages();
    return this.table.getPageCount();
  }

  getCanPreviousPage(): boolean { return this.getCurrentPage() > 1; }
  getCanNextPage(): boolean { return this.getCurrentPage() < this.getTotalPagesCount(); }
  previousPage() { if (this.getCanPreviousPage()) this.onPageChange(this.getCurrentPage() - 1); }
  nextPage() { if (this.getCanNextPage()) this.onPageChange(this.getCurrentPage() + 1); }
  firstPage() { this.onPageChange(1); }
  lastPage() { this.onPageChange(this.getTotalPagesCount()); }

  // ------------------ Row / Action / Sort handlers ------------------
  onRowClick(row: any, event: Event) { this.rowClick.emit(row.original); }
  onActionClick(action: string, data: any, event: Event) { event.stopPropagation(); this.actionTriggered.emit({ action, data }); }
  onAction(type: string, data: any, event?: Event) { event?.stopPropagation(); this.rowAction.emit({ type, data, event }); }

  handleSort(column: any, event: Event) {
    event.preventDefault();
    if (this.tableConfig.sortable && column.getCanSort()) column.toggleSorting();
  }

  getCellValue(cell: any): string {
    const renderer = cell.column.columnDef.cell;
    if (typeof renderer === 'function') return renderer(cell.getContext());
    return cell.getValue();
  }

  Math = Math;
}
