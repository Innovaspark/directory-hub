// admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DxButtonModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
import {LoginDialogComponent} from "@components/auth/login-dialog/login-dialog.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DxButtonModule,
    DxFormModule,
    DxPopupModule
  ]
})
export class AdminModule { }
