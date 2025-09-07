import { Component, OnInit, OnDestroy } from '@angular/core';
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


@Component({
  selector: 'app-claude-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="homepage">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1>{{ config.heroTitle }}</h1>
          @if (!isMultiCity && primaryCity) {
            <p>{{ config.heroDescription }} in {{ primaryCity.name }}.</p>
          }
          @if (isMultiCity) {
            <p>{{ config.heroDescription }}. Search by location and type.</p>
          }

          <!-- Search Container -->
          <div class="search-container">
            <form class="search-form" (ngSubmit)="onSearch()">
              @if (isMultiCity) {
                <div class="search-group">
                  <label for="city">City</label>
                  <select id="city" class="search-input" [(ngModel)]="searchForm.city" name="city">
                    <option value="">All Cities</option>
                    @for (city of cities; track city.slug) {
                      <option [value]="city.slug">{{ city.name }}</option>
                    }
                  </select>
                </div>
              }
              <div class="search-group">
                <label for="venue">{{ config.singleVenueLabel }} Name</label>
                <input 
                  type="text" 
                  id="venue" 
                  class="search-input" 
                  [placeholder]="config.searchPlaceholder"
                  [(ngModel)]="searchForm.venue"
                  name="venue">
              </div>
              <button type="submit" class="search-btn">Search</button>
            </form>

            <!-- Venue Type Filters -->
            <div class="venue-filters">
              @for (type of venueTypes; track type.slug) {
                <button 
                  class="filter-btn"
                  [class.active]="selectedVenueType === type.slug"
                  (click)="onVenueTypeClick(type.slug)">
                  <span class="filter-icon">{{ type.icon }}</span>
                  {{ type.label }}
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <div class="container">
        <!-- Stats Section -->
        <div class="stats-bar">
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-number">{{ totalVenues }}</span>
              <span class="stat-label">{{ config.venuesLabel }}</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ cities.length }}</span>
              <span class="stat-label">{{ cities.length === 1 ? 'City' : 'Cities' }}</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ venueTypes.length }}</span>
              <span class="stat-label">{{ config.venueTypesLabel }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Updated Daily</span>
            </div>
          </div>
        </div>

        <!-- Multi-City: Browse by City -->
        @if (isMultiCity) {
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">Browse by City</h2>
              <a [routerLink]="['/cities']" class="section-link">All Cities →</a>
            </div>
            <div class="city-grid">
              @for (city of cities; track city.slug) {
                <a [routerLink]="['/venues', city.slug]" class="city-card">
                  <span class="city-emoji">{{ city.emoji }}</span>
                  <div class="city-name">{{ city.name }}</div>
                  <div class="city-count">{{ city.venueCount }} {{ config.venuesLabel.toLowerCase() }}</div>
                </a>
              }
            </div>
          </section>
        }

        <!-- Single City: Show Venues Directly -->
        @if (!isMultiCity && primaryCity) {
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">{{ primaryCity.name }} {{ config.venuesLabel }}</h2>
              <a [routerLink]="['/venues', primaryCity.slug]" class="section-link">Browse All →</a>
            </div>
            <div class="cards-grid">
              @for (venue of featuredVenues; track venue.id) {
                <a [routerLink]="['/venue', venue.city, venue.id]" class="card">
                  <div class="card-image">
                    <span class="venue-type-badge">{{ getVenueTypeLabel(venue.primary_type) }}</span>
                    {{ venue.name }}
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">{{ venue.name }}</h3>
                    <p class="card-meta">
                      📍 {{ getDisplayAddress(venue) }} • 
                      @if (venue.keywords) {
                        <span>🏷️ {{ getDisplayKeywords(venue.keywords) }}</span>
                      }
                      @if (venue.rating) {
                        <span> • ⭐ {{ venue.rating }}</span>
                      }
                    </p>
                    <p class="card-description">{{ venue.review_summary || 'No description available.' }}</p>
                  </div>
                </a>
              }
            </div>
          </section>
        }

        <!-- Multi-City: Featured Venues from All Cities -->
        @if (isMultiCity) {
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">Featured {{ config.venuesLabel }}</h2>
              <a [routerLink]="['/venues']" class="section-link">Browse All →</a>
            </div>
            <div class="cards-grid">
              @for (venue of featuredVenues; track venue.id) {
                <a [routerLink]="['/venue', venue.city, venue.id]" class="card">
                  <div class="card-image">
                    <span class="venue-type-badge">{{ getVenueTypeLabel(venue.primary_type) }}</span>
                    {{ venue.name }}
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">{{ venue.name }}</h3>
                    <p class="card-meta">
                      📍 {{ getCityName(venue.city!) }} • 
                      @if (venue.keywords) {
                        <span>🏷️ {{ getDisplayKeywords(venue.keywords) }}</span>
                      }
                      @if (venue.rating) {
                        <span> • ⭐ {{ venue.rating }}</span>
                      }
                    </p>
                    <p class="card-description">{{ venue.review_summary || 'No description available.' }}</p>
                  </div>
                </a>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `,
  styles: [`
    .homepage {
      background: #fafafa;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 4rem 0;
      text-align: center;
    }

    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-container {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) auto;
      gap: 1rem;
      align-items: end;
    }

    .search-group {
      display: flex;
      flex-direction: column;
    }

    .search-group label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .search-input, select.search-input {
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      background: white;
    }

    .search-input:focus, select.search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .search-btn {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease;
      white-space: nowrap;
    }

    .search-btn:hover {
      transform: translateY(-2px);
    }

    .venue-filters {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      border-radius: 25px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-btn:hover, .filter-btn.active {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }

    .filter-icon {
      font-size: 1.1rem;
    }

    .stats-bar {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      margin: 3rem 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: #667eea;
      display: block;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section {
      margin: 4rem 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
    }

    .section-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .card-image {
      height: 200px;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
      position: relative;
    }

    .venue-type-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.9);
      color: #333;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .card-meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .card-description {
      color: #888;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .city-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .city-card {
      background: white;
      padding: 2rem 1.5rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .city-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .city-emoji {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      display: block;
    }

    .city-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .city-count {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.2rem;
      }

      .search-form {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .venue-filters {
        gap: 0.5rem;
      }

      .filter-btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ClaudeHomeLayout implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = config;
      });

    // Load venue types from tenant service
    this.tenantService.getVenueTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => {
        this.venueTypes = types;
      });

    // Load cities and venue data
    combineLatest([
      this.cityService.getActiveCities(),
      this.cityService.isMultiCity,
      this.cityService.primaryCity
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([cities, isMultiCity, primaryCity]) => {
      this.cities = cities;
      this.isMultiCity = isMultiCity;
      this.primaryCity = primaryCity;
      this.totalVenues = cities.reduce((sum, city) => sum + city.venueCount, 0);

      this.loadFeaturedVenues();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFeaturedVenues(): void {
    const citySlug = !this.isMultiCity && this.primaryCity ? this.primaryCity.slug : undefined;
    // Call your existing venue service method
    this.venueService.getFeaturedVenues(citySlug, 3)
      .pipe(takeUntil(this.destroy$))
      .subscribe(venues => {
        this.featuredVenues = venues;
      });
  }

  onSearch(): void {
    const queryParams: any = {};

    if (this.searchForm.venue) {
      queryParams.q = this.searchForm.venue;
    }

    if (this.isMultiCity) {
      if (this.searchForm.city) {
        this.router.navigate(['/venues', this.searchForm.city], { queryParams });
      } else {
        this.router.navigate(['/venues'], { queryParams });
      }
    } else if (this.primaryCity) {
      this.router.navigate(['/venues', this.primaryCity.slug], { queryParams });
    }
  }

  onVenueTypeClick(venueType: string): void {
    this.selectedVenueType = this.selectedVenueType === venueType ? null : venueType;

    const queryParams = venueType ? { type: venueType } : {};

    if (this.isMultiCity) {
      this.router.navigate(['/venues'], { queryParams });
    } else if (this.primaryCity) {
      this.router.navigate(['/venues', this.primaryCity.slug], { queryParams });
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
