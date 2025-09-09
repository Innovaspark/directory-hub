// carousel.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="carousel-container">
          <button
                  class="carousel-btn carousel-prev"
                  (click)="scrollLeft()"
                  [attr.aria-label]="'Scroll left'"
                  type="button">
              ‹
          </button>

          <div
                  #scrollContainer
                  class="carousel-track"
                  (scroll)="onScroll()">
              <div class="carousel-content">
                  <ng-content></ng-content>
              </div>
          </div>

          <button
                  class="carousel-btn carousel-next"
                  (click)="scrollRight()"
                  [attr.aria-label]="'Scroll right'"
                  type="button">
              ›
          </button>
      </div>
  `,
  styles: [`
      .carousel-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
      }

      .carousel-track {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex: 1;
          scroll-behavior: smooth;
      }

      .carousel-track::-webkit-scrollbar {
          display: none;
      }

      .carousel-content {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 1rem;
          width: max-content;
      }

      .carousel-btn {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
          color: #374151;
          transition: all 0.2s ease;
          flex-shrink: 0;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .carousel-btn:hover:not(.hidden) {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: scale(1.05);
      }

      .carousel-btn:active:not(.hidden) {
          transform: scale(0.95);
      }

      .carousel-btn.hidden {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.8);
      }

      .carousel-prev {
          margin-right: 0.5rem;
      }

      .carousel-next {
          margin-left: 0.5rem;
      }

      @media (max-width: 768px) {
          .carousel-btn {
              width: 36px;
              height: 36px;
              font-size: 1.2rem;
          }

          .carousel-content {
              gap: 0.8rem;
              padding: 0.5rem;
          }
      }

      /* Hide buttons when not needed */
      @media (max-width: 480px) {
          .carousel-btn {
              display: none;
          }

          .carousel-container {
              gap: 0;
          }
      }
  `]
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  @Input() scrollAmount = 200;
  @Input() autoHideButtons = true;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  canScrollLeft = false;
  canScrollRight = false;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    // Try multiple approaches to get the element
    setTimeout(() => {
      // Approach 1: ViewChild
      if (this.scrollContainer?.nativeElement) {
        this.checkScrollability(this.scrollContainer.nativeElement);
      } else {
        // Approach 2: Direct query
        const element = document.querySelector('.carousel-track') as HTMLElement;
        if (element) {
          this.checkScrollability(element);
        } else {
        }
      }
    }, 200);
  }

  private checkScrollability(element: HTMLElement) {

    // Try getting the scrollable content
    const content = element.querySelector('.carousel-content') as HTMLElement;
    if (content) {
    } else {
    }

    this.updateScrollButtons();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  scrollLeft() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: -this.scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({
        left: this.scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  onScroll() {
    this.updateScrollButtons();
  }

  private updateScrollButtons() {
    if (!this.scrollContainer) return;

    const element = this.scrollContainer.nativeElement;
    const tolerance = 1; // Account for sub-pixel scrolling

    this.canScrollLeft = element.scrollLeft > tolerance;
    this.canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth - tolerance);
  }

  // Public method to scroll to start (useful for dynamic content)
  scrollToStart() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  // Public method to scroll to end
  scrollToEnd() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        left: this.scrollContainer.nativeElement.scrollWidth,
        behavior: 'smooth'
      });
    }
  }
}
