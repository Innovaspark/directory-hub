// expand-header.ts
import {Component, OnInit, OnDestroy, HostListener, ElementRef, Inject, PLATFORM_ID, inject} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {RouterLink} from "@angular/router";
import {NavigationService} from "@core/services/navigation.service";
import {RouterStateService} from "@core/services/router-state.service";

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
<!--          <ul class="nav-list">-->
<!--            <li><a [routerLink]="'/'">Home</a></li>-->
<!--          </ul>-->
        </nav>
        <div class="header-actions">
            @if($isOnHomePage()) {
          <button class="btn-primary" [class.btn-small]="isContracted"
                  (click)="getStarted()"
          >
            Get Started
          </button>
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

    .logo-img {
        height: 56px; /* Normal size */
        width: auto;
        transition: height 0.3s ease;
        display: block;
    }

    .logo-img.logo-small {
        height: 42px; /* Contracted size */
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

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .btn-primary.btn-small {
      padding: 0.5rem 1.2rem;
      font-size: 0.9rem;
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .header-content {
        padding: 0 1rem;
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
    }
  `]
})
export class ExpandHeader implements OnInit, OnDestroy {
  isContracted = false;
  isScrolled = false;
  // logoText = 'YourLogo';
  isBrowser = false;

  private scrollThreshold = 50;
  private contractThreshold = 100;
  private routerStateService = inject(RouterStateService);
  $isOnHomePage = this.routerStateService.$isHomePage;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private navigationService: NavigationService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Only run on client-side
    if (this.isBrowser) {
      // Initial check in case page is already scrolled
      this.checkScroll();
    }
  }

  ngOnDestroy() {
    // Cleanup handled automatically by Angular for HostListener
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // Only run on client-side
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  private checkScroll() {
    // Double-check we're in browser environment
    if (!this.isBrowser || typeof window === 'undefined') {
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;

    // Add scrolled class for background opacity change
    this.isScrolled = scrollY > this.scrollThreshold;

    // Contract header when scrolled past threshold
    this.isContracted = scrollY > this.contractThreshold;
  }

  getStarted() {
    this.navigationService.navigateToCountry('nl');
  }
}
