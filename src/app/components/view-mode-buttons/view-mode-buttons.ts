import {Component, inject, input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {VenueStateService} from "@core/services/venue-state.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-view-mode-buttons',
  imports: [CommonModule],
  template: `
      <div class="flex justify-end mb-2 space-x-1.5">
          <!-- Card View Button -->
          <div class="relative group">
              <button
                      type="button"
                      (click)="setViewMode('cards')"
                      [ngClass]="{
                          'bg-emerald-500 text-white border-emerald-500': $viewMode() === 'cards',
                          'bg-gray-200 text-gray-900 border-gray-400': $viewMode() !== 'cards'
                        }"
                      class="p-1.5 rounded-md transition border cursor-pointer">
                  <i [class]="'fas fa-' + cardViewIcon"></i>
              </button>
              <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                        Card View
                      </span>
          </div>

          <!-- Split View Button -->
          <div class="relative group">
              <button
                      type="button"
                      (click)="setViewMode('split')"
                      [ngClass]="{
                          'bg-emerald-500 text-white border-emerald-500': $viewMode() === 'split',
                          'bg-gray-200 text-gray-900 border-gray-400': $viewMode() !== 'split'
                        }"
                      class="p-1.5 rounded-md transition border cursor-pointer">
                  <i [class]="'fas fa-' + splitViewIcon"></i>
              </button>
              <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                        Map View
                      </span>
          </div>
      </div>

  `
})
export class ViewModeButtons {

  venueState = inject(VenueStateService);
  $viewMode = this.venueState.$viewMode;

  cardViewIcon = 'th-large';
  splitViewIcon = 'map';

  setViewMode(mode: 'cards' | 'split') {
    this.venueState.setViewMode(mode);
  }

}
