import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
      <!-- Search Panel -->
      <div class="bg-white border-b border-gray-200 shadow-sm">
          <div class="container mx-auto px-6 py-4">
              <div class="flex items-center gap-4">
                  <!-- Search Input -->
                  <div class="flex-1">
                      <div class="p-px bg-gradient-cyan focus-within:ring-2 focus-within:ring-indigo-500 rounded-lg">
                          <input
                                  class="w-full px-4 py-3 placeholder-gray-500 text-base text-gray-700 bg-white outline-none rounded-lg"
                                  type="text"
                                  placeholder="Search for venues, events, or artists..."
                                  [(ngModel)]="searchTerm"
                                  (keyup.enter)="onSearch()"
                          />
                      </div>
                  </div>
                  <!-- City Combobox -->
                  <div class="min-w-[180px]">
                      <select
                              class="w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              [(ngModel)]="selectedCitySlug"
                      >
                          <option value="">All Cities</option>
                          @for (city of cities; track city.slug) {
                          <option [value]="city.slug">{{ city.emoji }} {{ city.name }}</option>
                          }
                      </select>
                  </div>
                  <!-- Search Button -->
                  <button
                          class="inline-block group p-0.5 font-heading text-base text-white font-bold bg-gradient-cyan hover:bg-gray-50 overflow-hidden rounded-md"
                          (click)="onSearch()"
                          [disabled]="!searchTerm.trim()"
                  >
                      <div class="relative py-3 px-8 bg-gradient-cyan rounded">
                          <div class="absolute top-0 left-0 transform -translate-y-full group-hover:-translate-y-0 h-full w-full bg-white transition ease-in-out duration-500"></div>
                          <span class="relative z-10 group-hover:text-gray-900">Search</span>
                      </div>
                  </button>
              </div>
          </div>
      </div>
  `
})
export class Search {
  private navigationService = inject(NavigationService);

  searchTerm = '';
  selectedCitySlug = '';

  cities = [
    { slug: 'amsterdam', name: 'Amsterdam', emoji: '🏙️' },
    { slug: 'utrecht', name: 'Utrecht', emoji: '🌿' },
    { slug: 'rotterdam', name: 'Rotterdam', emoji: '🚢' },
    { slug: 'the-hague', name: 'The Hague', emoji: '🏛️' },
    { slug: 'eindhoven', name: 'Eindhoven', emoji: '💡' },
    { slug: 'groningen', name: 'Groningen', emoji: '🌟' }
  ];

  onSearch(): void {
    if (!this.searchTerm.trim()) return;

    this.navigationService.navigateToSearch(
      this.searchTerm,
      'nl',
      this.selectedCitySlug || undefined
    );
  }
}
