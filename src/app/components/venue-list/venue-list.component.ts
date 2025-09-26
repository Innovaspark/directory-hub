import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  PLATFORM_ID,
  computed,
  effect, signal
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { VenueStateService } from "@core/state/venue-state.service";
import {ViewModeButtons} from "@components/view-mode-buttons/view-mode-buttons";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {VenuesMapComponent} from "@components/venues-map/venues-map";
import {VenueCardComponent} from "@components/venue-card/venue-card";
import {RouterStateService} from "@core/state/router-state.service";
import {SeoService} from "@core/services/seo.service";
import {FloatingToolbarComponent} from '@components/floating-toolbar';
import {MobileDetectionService} from '@services/mobile-detection.service';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [CommonModule, ViewModeButtons, InfiniteScrollDirective, VenuesMapComponent, VenueCardComponent, FloatingToolbarComponent],
  templateUrl: './venue-list.component.html',
  styles: [`
        .full-layout {
            display: block;
        }

        /*.split-layout {*/
        /*    display: grid;*/
        /*    grid-template-columns: 1fr 1fr;*/
        /*    gap: 2rem;*/
        /*}*/

        .split-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          height: 100vh; /* full viewport height so panels can scroll independently */
          max-height: 100vh; /* total viewport height */
          overflow-y: auto;  /* container scrolls if content exceeds viewport */
          padding: 1rem;
        }

        .split-layout.hide-left {
          grid-template-columns: 0 1fr;
          gap: 0;
          padding: 0;
        }

        .split-layout.hide-left > *:first-child {
          visibility: hidden;
          width: 0;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .split-layout {
            grid-template-columns: 0 1fr;
            gap: 0;
          }

          .split-layout > *:first-child {
            visibility: hidden;
            width: 0;
            overflow: hidden;
          }
        }

          .left-panel,
        .right-panel {
          overflow-y: auto;   /* each panel scrolls independently */
          max-height: 100%;   /* constrain height to grid row */
          padding: 1rem;
        }

        .right-panel {
          padding: 0;
        }

        .map-placeholder {
            background: #f5f5f5;
            border: 2px dashed #ddd;
            border-radius: 8px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 1.2rem;
        }
  `]
})
export class VenueListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loadTrigger') loadTrigger!: ElementRef;
  @ViewChildren('venueCard', { read: ElementRef }) venueCards!: QueryList<ElementRef>;
  @ViewChild('mapPanel') mapPanel!: ElementRef<HTMLDivElement>;

  private venueState = inject(VenueStateService);
  private mobileDetectionService = inject(MobileDetectionService);
  isMobile = this.mobileDetectionService.isMobile();
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  $viewMode = this.venueState.$viewMode;
  isBrowser = isPlatformBrowser(this.platformId);
  cardViewIcon = 'th-large';
  splitViewIcon = 'map';

  // Get data from venue state service - all loading states managed there now
  $selectedVenue = this.venueState.$selectedVenue;
  $venues = this.venueState.$filteredVenues;
  $isLoading = this.venueState.$isLoading;
  $isLoadingMore = this.venueState.$isLoadingMore;
  $totalVenueCount = this.venueState.$totalVenueCount;
  $venueTypes = computed(() => this.venueState.$filterOptions());

  // Simplified loading spinner logic - all managed by service
  $showLoadingSpinner = computed(() => {
    const apiLoading = this.$isLoading();
    const moreLoading = this.$isLoadingMore();
    const hasVenues = this.$venues().length > 0;

    return (apiLoading || moreLoading) && hasVenues;
  });
  private seo = inject(SeoService);
  private routerState = inject(RouterStateService);


  constructor() {
    // Auto-scroll to selected venue
    effect(() => {
      const selectedVenue = this.$selectedVenue();
      if (selectedVenue) {
        setTimeout(() => {
          this.scrollToSelectedVenue(selectedVenue.id);
        }, 100);
      }
      // const viewMode = this.$viewMode();
      // if (viewMode && selectedVenue) {
      //   this.scrollToSelectedVenue(selectedVenue.id);
      // }
    });
  }

  ngOnInit() {
    this.venueState.startVenueLoading();
    const citySlug = this.routerState.$citySlug();
    const countryCode = this.routerState.$countryCode();

    let locationName = '';
    if (citySlug && citySlug !== 'all') {
      locationName = citySlug;
    } else if (countryCode) {
      locationName = countryCode.toUpperCase();
    } else {
      locationName = 'the Netherlands';
    }

    this.seo.setMeta({
      title: `${locationName} Venues – Live Bands, Jam Sessions & Open Mics | GigaWhat`,
      description: `Find the best live music venues in ${locationName}, featuring jam sessions, open mics, live bands, concerts, and gigs.`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${locationName} Venues`,
        "description": `Live music venues in ${locationName}: jam sessions, open mics, live bands, concerts, festivals, and gigs.`,
      },
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // window.scrollTo({ top: 0, behavior: 'auto' });
    }
    // this.mobileDetectionService.debug();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.venueState.stopVenueLoading();
  }

  onScrollDown() {
    this.venueState.loadMoreVenues();
  }

  scrollToSelectedVenue(venueId: string) {
    const venues = this.$venues();
    const selectedIndex = venues.findIndex(v => v.id === venueId);

    if (selectedIndex >= 0 && this.venueCards) {
      const cardElement = this.venueCards.toArray()[selectedIndex];
      if (cardElement) {
        cardElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }

  scrollRightToElement(elementId: string) {
    const container = this.mapPanel.nativeElement;
    const target = container.querySelector(`#${elementId}`) as HTMLElement;
    if (target) {
      container.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth' // optional
      });
    }
  }

}
