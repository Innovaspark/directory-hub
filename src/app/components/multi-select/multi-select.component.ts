// multi-select.component.ts
import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-select.component.html'
})
export class MultiSelectComponent {
  @Input() keywords: string[] = [];

  open = false;
  selected: string[] = [];
  selectedMap: { [key: string]: boolean } = {};

  toggleDropdown() {
    this.open = !this.open;
  }

  updateSelected() {
    this.selected = this.keywords.filter(k => this.selectedMap[k]);
  }
}
