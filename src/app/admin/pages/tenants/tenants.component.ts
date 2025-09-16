// tenant-table.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TenantTableComponent} from '../../shared/components/tentant-table/tenant-table.component';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, TenantTableComponent],
  template: `
    <app-tenant-table></app-tenant-table>
  `
})
export class TenantsComponent  {

}
