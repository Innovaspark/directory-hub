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
