import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';
import {TenantsComponent} from './pages/tenants/tenants.component';
import {TenantEditComponent} from './pages/tenant-edit/tenant-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'tenants/:id/edit',
    component: TenantEditComponent
  },
  {
    path: 'tenants',
    component: TenantsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
