import {Component, OnInit, OnDestroy, inject, DestroyRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import {City} from "@core/models/city.model";
import {Venue} from "@core/models/venue.model";
import {VenueType} from "@core/models/venue-type.model";
import {DirectoryConfig} from "@core/models/directory-config.model";
import {CityService} from "@core/services/city.service";
import {TenantService} from "@core/services/tenant.service";
import {VenueService} from "@services/venue.service";
import {DirectoryConfigService} from "@core/services/directory-config.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-claude-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './claude-home-layout.html',
  styleUrls: ['./claue-home-layout.scss']
})
export class ClaudeHomeLayout implements OnInit {
  private destroyRef = inject(DestroyRef);

  cities: City[] = [];
  featuredVenues: Venue[] = [];
  venueTypes: VenueType[] = [];
  config: DirectoryConfig = {} as DirectoryConfig;
  isMultiCity = false;
  primaryCity: City | null = null;
  totalVenues = 0;
  selectedVenueType: string | null = null;

  searchForm = {
    city: '',
    venue: ''
  };

  constructor(
    private cityService: CityService,
    private venueService: VenueService, // Your existing service
    private tenantService: TenantService,
    private configService: DirectoryConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load configuration
    this.configService.getConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(config => {
        this.config = config;
      });

    // Load venue types from tenant service
    this.tenantService.getVenueTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(types => {
        this.venueTypes = types;
      });

    // Load cities and venue data
    combineLatest([
      this.cityService.getActiveCities(),
      this.cityService.isMultiCity,
      this.cityService.primaryCity
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([cities, isMultiCity, primaryCity]) => {
      this.cities = cities;
      this.isMultiCity = isMultiCity;
      this.primaryCity = primaryCity;
      this.totalVenues = cities.reduce((sum, city) => sum + city.venueCount, 0);

      this.loadFeaturedVenues();
    });
  }

  private loadFeaturedVenues(): void {
    const citySlug = !this.isMultiCity && this.primaryCity ? this.primaryCity.slug : undefined;
    // Call your existing venue service method
    this.venueService.getFeaturedVenues(citySlug, 3)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(venues => {
        this.featuredVenues = venues;
      });
  }

  onSearch(): void {
    const queryParams: any = {};
    if (this.searchForm.venue) {
      queryParams.q = this.searchForm.venue;
    }

    // Route to city-specific venue page
    const targetCity = this.isMultiCity ? this.searchForm.city : this.primaryCity?.slug;
    if (targetCity) {
      this.router.navigate(['/venues', targetCity], { queryParams });
    } else {
      // Fallback to general venues page if no city selected
      this.router.navigate(['/venues'], { queryParams });
    }
  }

  onVenueTypeClick(venueType: string): void {
    this.selectedVenueType = this.selectedVenueType === venueType ? null : venueType;

    const queryParams = venueType ? { type: venueType } : {};

    // Route to city-specific venue page with type filter
    const targetCity = this.primaryCity?.slug;
    if (targetCity) {
      this.router.navigate(['/venues', targetCity], { queryParams });
    } else {
      this.router.navigate(['/venues'], { queryParams });
    }
  }

  getVenueTypeLabel(venueType: string): string {
    const type = this.venueTypes.find(t => t.slug === venueType);
    return type ? type.label : venueType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getCityName(citySlug: string): string {
    const city = this.cities.find(c => c.slug === citySlug);
    return city ? city.name : citySlug;
  }

  getDisplayAddress(venue: Venue): string {
    if (venue.street) {
      return venue.street;
    }
    if (venue.full_address) {
      return venue.full_address.split(',')[0];
    }
    return `${venue.city}, ${venue.state}`;
  }

  getDisplayKeywords(keywords: string): string {
    return keywords.split(',').slice(0, 3).map(k => k.trim()).join(', ');
  }
}
