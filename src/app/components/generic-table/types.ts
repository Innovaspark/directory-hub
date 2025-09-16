// types/table-column.interface.ts
import { ColumnDef } from '@tanstack/angular-table';

export type TableColumn<T = any> = ColumnDef<T>;

// types/table-config.interface.ts
export interface TableConfig {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showPagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  responsive?: boolean;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
}

// types/table-action.interface.ts
export interface TableAction<T = any> {
  type: string;
  data: T;
  event?: Event;
}

// Default table configuration
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  title: '',
  showSearch: true,
  searchPlaceholder: 'Search...',
  showPagination: true,
  pageSize: 10,
  sortable: true,
  filterable: true,
  responsive: true,
  striped: true,
  hover: true,
  bordered: true,
};
