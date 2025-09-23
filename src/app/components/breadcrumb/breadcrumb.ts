import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RouterStateService } from '@core/state/router-state.service';
import { VenueStateService } from '@core/state/venue-state.service';

// Hardcoded country lookup
const COUNTRY_NAMES: { code: string; name: string }[] = [
  { code: 'nl', name: 'Netherlands' },
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
];

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
      <div class="bg-gray-50 border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 py-3">
              <nav class="flex cursor-pointer" aria-label="Breadcrumb">
                  <ol class="flex items-center space-x-2">
                      <li>
                        <a class="breadcrumb" [routerLink]="['/', routerState.$countryCode()]">{{ countryName() }}</a>
                      </li>
                      <li><span class="text-gray-400">/</span></li>
                      <li>
                        <a class="breadcrumb" [routerLink]="['/', routerState.$countryCode(), routerState.$citySlug()]">
                          {{ routerState.$citySlug() }}
                        </a>
                      </li>
                      <li><span class="text-gray-400">/</span></li>
                      <li>
                        <a [routerLink]="['/', routerState.$countryCode(), routerState.$citySlug(), 'venues']">
                          Venues
                        </a>
                      </li>
                      <li><span class="text-gray-400">/</span></li>
                      <li>
                        <span class="text-gray-900 font-medium">
                          {{ venueState.$currentVenue()?.name }}
                        </span>
                      </li>

                      <!-- Back arrow flush with breadcrumb -->
                      <li>
                        <a
                          class="pl-2 text-gray-500 hover:text-gray-700 flex items-center"
                          [routerLink]="['/', routerState.$countryCode(), routerState.$citySlug(), 'venues']"
                          aria-label="Back to Venues"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 class="h-5 w-8"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M21 12H2m0 0l7-7m-7 7l7 7"/>
                            </svg>

                        </a>
                      </li>
                  </ol>
              </nav>
          </div>
      </div>
  `,
  styles: [`
      .breadcrumb {
          font-family: Arial, sans-serif;
          font-size: 14px;
      }
      .breadcrumb a {
          text-decoration: none;
          color: #0077cc;
      }
      .breadcrumb span {
          margin: 0 4px;
          color: #666;
      }
  `]
})
export class BreadcrumbComponent {
  routerState = inject(RouterStateService);
  venueState = inject(VenueStateService);

  // Country lookup from array
  countryName = computed(() => {
    const code = this.routerState.$countryCode();
    if (!code) return null;
    const found = COUNTRY_NAMES.find(c => c.code.toLowerCase() === code.toLowerCase());
    return found ? found.name : code.toUpperCase();
  });

  private _venueName = signal<string | null>(null);
  venueName = computed(() => this._venueName());

  isVenue = computed(() => this.routerState.$url().includes('/venues/'));

  constructor() {
    const url = this.routerState.$url();
    const match = url.match(/venues\/([^\/]+)/);
    if (match) {
      this._venueName.set(`Venue ${match[1]}`);
    }
  }
}
