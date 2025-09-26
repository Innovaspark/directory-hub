import { Component, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #toolbar class="floating-toolbar">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .floating-toolbar {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.95);
      padding: 0.5rem 0.75rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      min-width: 3.5rem;
      z-index: 1000;
      transition: top 0.2s ease, left 0.2s ease;
      right: 30px;
      top: 190px;
    }

    .toolbar-btn {
      background: #007bff;
      color: #fff;
      border: none;
      padding: 0.35rem 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: background 0.2s ease, transform 0.1s ease;
    }

    .toolbar-btn:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }

    .toolbar-btn:active {
      transform: translateY(0);
    }
  `]
})
export class FloatingToolbarComponent implements AfterViewInit {
  @ViewChild('toolbar') toolbar!: ElementRef<HTMLDivElement>;

  /** Pass the parent container explicitly */
  // @Input() parent!: HTMLElement;

  ngAfterViewInit() {
    // const toolbarEl = this.toolbar.nativeElement;
    //
    // if (this.parent) {
    //   const parentRect = this.parent.getBoundingClientRect();
    //
    //   // Toolbar top: slightly below parent's top
    //   const offsetTop = parentRect.top + window.scrollY - 30;  // 10px margin
    //
    //   // Toolbar left: parent right minus toolbar width minus margin
    //   const offsetLeft = parentRect.right - toolbarEl.offsetWidth + 60;
    //
    //   toolbarEl.style.top = `${offsetTop}px`;
    //   toolbarEl.style.left = `${offsetLeft}px`;
    // } else {
    //   console.warn('FloatingToolbarComponent: parent input not provided');
    // }
  }
}
