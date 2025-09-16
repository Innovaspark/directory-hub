// admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import {FooterComponent} from '@components/footer/footer.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    FooterComponent,
  ]
})
export class AdminModule { }
