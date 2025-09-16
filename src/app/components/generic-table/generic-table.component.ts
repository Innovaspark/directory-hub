// generic-table.component.ts
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

  @Output() rowClick = new EventEmitter<T>();
  @Output() rowAction = new EventEmitter<TableAction<T>>();

  // Internal signals for reactivity
  private dataSignal = signal<T[]>([]);
  private globalFilter = signal('');

  // Merged configuration
  tableConfig: TableConfig = DEFAULT_TABLE_CONFIG;

  table = createAngularTable(() => ({
    data: this.dataSignal(),
    columns: this.columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: this.tableConfig.sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: this.tableConfig.filterable ? getFilteredRowModel() : undefined,
    getPaginationRowModel: this.tableConfig.showPagination ? getPaginationRowModel() : undefined,
    state: {
      globalFilter: this.globalFilter(),
    },
    onGlobalFilterChange: (updater) => {
      if (this.tableConfig.filterable) {
        const value = typeof updater === 'function' ? updater(this.globalFilter()) : updater;
        this.globalFilter.set(value ?? '');
      }
    },
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: this.tableConfig.pageSize || 10,
      },
    },
  }));

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
  }

  private updateConfig() {
    this.tableConfig = { ...DEFAULT_TABLE_CONFIG, ...this.config };
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
