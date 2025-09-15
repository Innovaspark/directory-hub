// expand-header.ts - Complete with UserStateService only
import {Component, OnInit, OnDestroy, HostListener, ElementRef, Inject, PLATFORM_ID, inject} from '@angular/core';
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
  template: `
    <header
      class="header"
      [class.contracted]="isContracted"
      [class.scrolled]="isScrolled">
      <div class="header-content">
        <div class="logo">
          <a [routerLink]="'/'">
            <img src="/images/logos/main-logo.svg"
                 alt="GigaWhat.live"
                 class="logo-img"
                 [class.logo-small]="isContracted">
          </a>
        </div>
        <nav class="nav">
        </nav>
        <div class="header-actions">
          @if($isOnHomePage()) {
          <div class="button-group">
            <button class="btn-secondary" [class.btn-small]="isContracted"
                    (click)="getStarted()">
              Get Started
            </button>

            @if(!$isLoggedIn()) {
          <button class="btn-login" [class.btn-small]="isContracted"
                  (click)="login()">
            Login
          </button>
          } @else {
          <div class="user-dropdown" [class.dropdown-small]="isContracted">
            <button class="btn-profile" [class.btn-small]="isContracted"
                    (click)="toggleUserMenu()">
              <svg class="user-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span class="user-name">{{ $displayName() }}</span>
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>

            @if(showUserMenu) {
            <div class="dropdown-menu">
              <button class="dropdown-item" (click)="profile()">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                Profile
              </button>
              <button class="dropdown-item" (click)="logout()">
                <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </div>
            }
          </div>
          }
          </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 80px;
      backdrop-filter: blur(10px);
    }

    .header.contracted {
      height: 60px;
      background: rgba(102, 126, 234, 0.95);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }

    .header.scrolled {
      background: rgba(102, 126, 234, 0.98);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      transition: all 0.3s ease;
    }

    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-list li a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      opacity: 0.9;
    }

    .nav-list li a:hover {
      opacity: 1;
      transform: translateY(-1px);
    }

    .nav-list li a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.8);
      transition: width 0.3s ease;
    }

    .nav-list li a:hover::after {
      width: 100%;
    }

    .header-actions {
      display: flex;
      align-items: center;
    }

    .button-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-secondary,
    .btn-login {
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      text-transform: none;
      letter-spacing: 0.2px;
      min-width: 85px;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    }

    .btn-login {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: white;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
    }

    .btn-login:hover {
      background: linear-gradient(135deg, #ff5252 0%, #e53935 100%);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    }

    .user-dropdown {
      position: relative;
    }

    .btn-profile {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
    }

    .btn-profile:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    .user-icon, .dropdown-arrow {
      width: 16px;
      height: 16px;
    }

    .user-name {
      flex: 1;
      text-align: left;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(0, 0, 0, 0.1);
      min-width: 160px;
      z-index: 1001;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      color: #333;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-radius: 0;
    }

    .dropdown-item:first-child {
      border-radius: 12px 12px 0 0;
    }

    .dropdown-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .dropdown-item:hover {
      background-color: #f5f5f5;
    }

    .dropdown-icon {
      width: 16px;
      height: 16px;
      color: #666;
    }

    .btn-small {
      padding: 0.4rem 0.8rem !important;
      font-size: 0.8rem !important;
      min-width: 75px !important;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 1rem;
      }

      .button-group {
        gap: 0.5rem;
      }

      .btn-secondary,
      .btn-login {
        padding: 0.45rem 0.9rem;
        font-size: 0.8rem;
        min-width: 75px;
      }

      .user-name {
        display: none;
      }

      .btn-profile {
        min-width: 45px;
        padding: 0.45rem 0.75rem;
      }

      .nav-list {
        gap: 1rem;
      }

      .nav-list li a {
        font-size: 0.9rem;
      }

      .logo h1 {
        font-size: 1.5rem;
      }

      .logo h1.logo-small {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 480px) {
      .nav-list {
        display: none;
      }

      .header-content {
        justify-content: space-between;
      }

      .button-group {
        gap: 0.4rem;
      }

      .btn-secondary,
      .btn-login {
        padding: 0.35rem 0.7rem;
        font-size: 0.75rem;
        min-width: 65px;
      }
    }
  `]
})
export class ExpandHeader implements OnInit, OnDestroy {

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

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private navigationService: NavigationService,
    private modalService: ModalService
  ) {
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
}
