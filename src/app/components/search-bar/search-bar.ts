import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '@core/services/navigation.service';
import { RouterStateService } from "@core/state/router-state.service";
import { VenueStateService } from "@core/state/venue-state.service";
import {MultiSelectComponent} from '@components/multi-select/multi-select.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectComponent],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss']
})
export class SearchBarComponent {
  private navigationService = inject(NavigationService);
  private routerState = inject(RouterStateService);
  venueState = inject(VenueStateService);

  selectedCitySlug = '';
  searchTerm = '';
  keywordsTerm = '';

  // private keywords: string[] = ["jazz clubs","live jazz","evening performances"]
  $isSearching = this.venueState.$isLoading;
  $isSearching2 = this.venueState.$isLoading2;

  // Local hardcoded cities - replace with data service later
  cities = [
    { id: 1, slug: 'amersfoort', name: 'Amersfoort', emoji: '🏙️' },
    // { id: 2, slug: 'amsterdam', name: 'Amsterdam', emoji: '🏙️' },
    // { id: 3, slug: 'utrecht', name: 'Utrecht', emoji: '🌿' },
    // { id: 4, slug: 'rotterdam', name: 'Rotterdam', emoji: '🚢' },
    // { id: 5, slug: 'the-hague', name: 'The Hague', emoji: '🏛️' },
    // { id: 6, slug: 'eindhoven', name: 'Eindhoven', emoji: '💡' },
    // { id: 7, slug: 'groningen', name: 'Groningen', emoji: '🌟' }
  ];

  ngOnInit(): void {
    this.searchTerm = this.routerState.$searchQuery();
    this.keywordsTerm = this.routerState.$queryParams()?.['keywords'] || '';
    const citySlug = this.routerState.$citySlug();
    if (citySlug && citySlug !== 'all') {
      this.selectedCitySlug = citySlug;
    }
    this.venueState.status$.subscribe(val => console.log('STATUS$', val));
  }

  onSearch(): void {
    const countryCode = 'nl';
    // this.venueState.doSearch(countryCode, this.selectedCitySlug, this.searchTerm, this.keywordsTerm)
    this.venueState.setStatus(true);
    this.venueState.setStatus(false);
  }

  clearSearch(): void {
    this.searchTerm = '';
    // Immediately update URL with empty search but keep keywords
    this.navigationService.navigateToSearch(
      '', // Empty search term
      'nl',
      this.selectedCitySlug || undefined,
      this.keywordsTerm // Keep existing keywords
    );
  }

  clearKeywords(): void {
    this.keywordsTerm = '';
    // Immediately update URL with empty keywords but keep search term
    this.navigationService.navigateToSearch(
      this.searchTerm, // Keep existing search term
      'nl',
      this.selectedCitySlug || undefined,
      '' // Empty keywords
    );
  }
}
