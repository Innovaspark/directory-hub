import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {TenantsComponent} from './pages/tenants/tenants.component';
import {TenantEditComponent} from './pages/tenant-edit/tenant-edit.component';
import {CountriesComponent} from './pages/countries/countries.component';
import {CountryEditComponent} from './pages/country-edit/country-edit.component';
import {EntityListComponent} from '@pages/entity-list/entity-list.component';
import {BulkUpdateVenuesComponent} from './pages/bulk-update-venues/bulk-update-venues';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'tenants',
    component: EntityListComponent
  },
  {
    path: 'countries',
    component: EntityListComponent
  },
  {
    path: 'cities',
    component: EntityListComponent
  },
  {
    path: 'venues',
    component: EntityListComponent
  },
  {
    path: 'venues-bulk-update',
    component: BulkUpdateVenuesComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
