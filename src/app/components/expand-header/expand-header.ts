import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID,
  inject,
  input
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {RouterLink} from "@angular/router";
import {NavigationService} from "@core/services/navigation.service";
import {RouterStateService} from "@core/services/router-state.service";
import {ModalService} from '@core/services/modal.service';
import {LoginDialogComponent} from '@components/auth/login-dialog/login-dialog.component';
import {UserStateService} from '@core/state/user-state.service';

@Component({
  selector: 'app-expand-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expand-header.html',
  styleUrls: ['./expand-header.scss']
})
export class ExpandHeader implements OnInit, OnDestroy {

  showButtons = input<boolean>(true);

  private platformId = inject(PLATFORM_ID);
  private navigationService = inject(NavigationService);
  private modalService = inject(ModalService);
  private routerStateService = inject(RouterStateService);
  private userStateService = inject(UserStateService);

  $isOnHomePage = this.routerStateService.$isHomePage;
  $isLoggedIn = this.userStateService.$isLoggedIn;
  $displayName = this.userStateService.$displayName;

  isContracted = false;
  isScrolled = false;
  isBrowser = false;
  showUserMenu = false;

  private scrollThreshold = 50;
  private contractThreshold = 100;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  ngOnDestroy() {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showUserMenu = false;
    }
  }

  private checkScroll() {
    if (!this.isBrowser || typeof window === 'undefined') {
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    this.isScrolled = scrollY > this.scrollThreshold;
    this.isContracted = scrollY > this.contractThreshold;
  }

  getStarted() {
    this.navigationService.navigateToCountry('nl');
  }

  login() {
    this.modalService.open(LoginDialogComponent);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  profile() {
    this.showUserMenu = false;
    // Navigate to profile page
  }

  async logout() {
    this.showUserMenu = false;
    await this.userStateService.signOut();
  }

  goToAdmin() {
    this.navigationService.navigateToAdmin();
  }

}
