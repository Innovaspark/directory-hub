import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { ExpandHeader } from "@components/expand-header/expand-header";
import {FooterComponent} from "@components/footer/footer.component";
import {HeaderComponent} from '@components/header/header.component';
import {DrawerComponent} from '@components/drawer/drawer';
import {SidebarMenuComponent} from '@components/sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, ExpandHeader, FooterComponent, DrawerComponent, SidebarMenuComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

}
