// seo.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterStateService } from '@core/services/router-state.service';
import { isPlatformBrowser } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  // JSON-LD is now rendered in component templates, not here
  jsonLd?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private platformId = inject(PLATFORM_ID);
  private title = inject(Title);
  private meta = inject(Meta);
  private routerState = inject(RouterStateService);

  // Default keywords for live music
  private defaultKeywords = 'open mics, jam sessions, gigs, live music, concerts, music venues, jazz clubs, rock concerts, festivals, music events, live bands, live performances';

  /** Set meta tags dynamically */
  setMeta(data: SeoData) {
    const url = data.url ?? this.routerState.$url();

    // Page title
    if (data.title) this.title.setTitle(data.title);

    // Description
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });

    // Keywords
    const keywords = data.keywords ? `${data.keywords}, ${this.defaultKeywords}` : this.defaultKeywords;
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph tags
    if (data.url) this.meta.updateTag({ property: 'og:url', content: url });
    if (data.title) this.meta.updateTag({ property: 'og:title', content: data.title });
    if (data.description) this.meta.updateTag({ property: 'og:description', content: data.description });
    if (data.image) this.meta.updateTag({ property: 'og:image', content: data.image });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Canonical link
    this.setCanonical(url);
  }

  /** Add canonical link dynamically (browser-only) */
  private setCanonical(url: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    if (link) {
      link.setAttribute('href', url);
    }
  }
}
