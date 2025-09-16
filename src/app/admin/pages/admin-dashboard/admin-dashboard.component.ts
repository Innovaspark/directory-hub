import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AdminSidebarComponent} from '../../shared/components/admin-sidebar/admin-sidebar';
import {AdminHeaderComponent} from '../../shared/components/admin-header/admin-header';
import {DrawerComponent} from '@components/drawer/drawer';
import {SidebarMenuComponent} from '@components/sidebar-menu/sidebar-menu';
import {ExpandHeader} from '@components/expand-header/expand-header';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  title = '';

}
