// tenant-table.component.ts
import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HasuraCrudService} from '@core/hasura/hasura-crud.service';
import {Apollo, gql} from 'apollo-angular';
import {GenericTableComponent} from '@components/generic-table/generic-table.component';
import {TableConfig} from '@components/generic-table/types';
import {NavigationService} from '@services/navigation.service';
import {Router} from '@angular/router';
import {map} from 'rxjs';
import {ModalService} from '@services/modal.service';
import {CountryEditFormComponent} from '@components/country-edit-form/country-edit-form.component';
import {LoginDialogComponent} from '@components/auth/login-dialog/login-dialog.component';

@Component({
  selector: 'app-entity-list',
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
export class EntityListComponent  implements OnInit {


  private hasuraCrud = inject(HasuraCrudService);
  private apollo = inject(Apollo);
  navigationService = inject(NavigationService);
  modalService = inject(ModalService);

  totalCount = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

  columns: any[] = [];
  data = signal<any[]>([]);
  tableConfig: TableConfig = {
    title: 'Country Management',
    searchPlaceholder: 'Search countries...',
  };

  entityName: string = '';

  constructor(private router: Router) {
    const url = this.router.url; // e.g., "/admin/cities?foo=bar"
    const segments = url.split('?')[0].split('/'); // remove query params, split by "/"
    this.entityName = segments[2] || ''; // segments[0]="" (leading slash), [1]="admin", [2]="cities"
    console.log('Entity:', this.entityName);
  }

  async ngOnInit() {
    // Step 1: get column config + query string
    const { columns, query } = await this.hasuraCrud.buildTableConfig(this.entityName);
    this.columns = columns;

    // Step 2: run the query with Apollo
    this.apollo
    .watchQuery<any>({ query: gql`${query}` })
    .valueChanges
    .subscribe(({ data, loading }) => {
      this.loading.set(loading);
      this.data.set(data?.[this.entityName] ?? []);
    });
  }

  onPageChange($event: number) {

  }

  onActionTriggered(event: {action: string, data: any}) {
    const { action, data } = event;

    switch (action) {
      case 'edit':
        this.editEntity(data);
        break;
      case 'delete':
        this.deleteEntity(data);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  private editEntity(entity: any) {
    // Navigate to edit page
    this.navigationService.navigateToChild(`/admin/${this.entityName}`, entity.id, 'edit');
    this.modalService.open(LoginDialogComponent);
  }

  private deleteEntity(entity: any) {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${entity.name}"? This action cannot be undone.`)) {
      // TODO: Implement actual delete via service
      console.log('Deleting entity:', entity);

      // For now, just reload the data
      // Later: call tenantService.deleteTenant(tenant.id) then reload
      // this.loadTenants();
      alert('add delete here');
    }
  }

}

