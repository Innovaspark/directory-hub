// tenant-table.component.ts
import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TenantTableComponent} from '../../shared/components/tentant-table/tenant-table.component';
import {HasuraCrudService} from '@core/hasura/hasura-crud.service';
import {Apollo, gql} from 'apollo-angular';
import {GenericTableComponent} from '@components/generic-table/generic-table.component';
import {TableConfig} from '@components/generic-table/types';
import {Tenant} from '@core/models/tenant.model';
import {Country} from '@core/models/country.model';
import {NavigationService} from '@services/navigation.service';

@Component({
  selector: 'app-countries',
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
export class CountriesComponent  implements OnInit {


  navigationService = inject(NavigationService);

  totalCount = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

  columns: any[] = [];
  data = signal<Country[]>([]);
  tableConfig: TableConfig = {
    title: 'Country Management',
    searchPlaceholder: 'Search countries...',
  };


  constructor(
    private hasuraCrud: HasuraCrudService,
    private apollo: Apollo
  ) {}

  async ngOnInit() {
    // Step 1: get column config + query string
    const { columns, query } = await this.hasuraCrud.buildTableConfig('countries');
    this.columns = columns;

    // Step 2: run the query with Apollo
    this.apollo
    .watchQuery<any>({ query: gql`${query}` })
    .valueChanges
    .subscribe(({ data, loading }) => {
      this.loading.set(loading);
      this.data.set(data?.countries ?? []);
    });
  }

  onPageChange($event: number) {

  }

  onActionTriggered(event: {action: string, data: Country}) {
    const { action, data } = event;

    switch (action) {
      case 'edit':
        this.editCountry(data);
        break;
      case 'delete':
        this.deleteCountry(data);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  private editCountry(country: Country) {
    // Navigate to edit page
    this.navigationService.navigateToChild('/admin/countries', country.id, 'edit');
  }

  private deleteCountry(country: Country) {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${country.name}"? This action cannot be undone.`)) {
      // TODO: Implement actual delete via service
      console.log('Deleting tenant:', country);

      // For now, just reload the data
      // Later: call tenantService.deleteTenant(tenant.id) then reload
      // this.loadTenants();
      alert('add delete here');
    }
  }

}
