// admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import {DxButtonModule, DxDrawerComponent, DxFormModule, DxPopupModule} from 'devextreme-angular';
import {LoginDialogComponent} from "@components/auth/login-dialog/login-dialog.component";
import {FooterComponent} from '@components/footer/footer.component';
import {DxTreeViewModule} from 'devextreme-angular/ui/tree-view';
import {RouterModule} from '@angular/router';
import {SideNavOuterToolbarComponent} from './layouts/side-nav-outer-toolbar/side-nav-outer-toolbar.component';
import {AdminDashboardComponent} from './pages/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    DxButtonModule,
    DxFormModule,
    DxPopupModule,
    DxTreeViewModule,
    FooterComponent,
    SideNavOuterToolbarComponent,
    DxDrawerComponent
  ]
})
export class AdminModule { }
