// seo.service.ts
import {Injectable, inject, Renderer2, RendererFactory2, PLATFORM_ID} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterStateService } from '@core/services/router-state.service';
import {isPlatformBrowser} from "@angular/common";

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private platformId = inject(PLATFORM_ID);
  private title = inject(Title);
  private meta = inject(Meta);
  private rendererFactory = inject(RendererFactory2);
  private routerState = inject(RouterStateService);
  private renderer: Renderer2;

  // Default keywords for live music
  private defaultKeywords = 'open mics, jam sessions, gigs, live music, concerts, music venues, jazz clubs, rock concerts, festivals, music events, live bands, live performances';

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

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

    // JSON-LD structured data
    if (data.jsonLd) {
      this.addJsonLd(data.jsonLd);
    }

    // Set canonical link
    this.setCanonical(url);
  }

  /** Add JSON-LD structured data dynamically */
  /** Add JSON-LD structured data dynamically (SSR-friendly) */
  private addJsonLd(jsonLd: Record<string, any>) {
    // Remove any previously rendered JSON-LD
    const existing = document.querySelectorAll('script[type="application/ld+json"]');
    existing.forEach(el => el.remove());

    // Create the script element
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';

    // Use JSON.stringify to inject data
    script.text = JSON.stringify(jsonLd);

    // Append to head
    // Renderer2 works both in SSR and browser
    this.renderer.appendChild(document.head, script);
  }

  /** Add canonical link dynamically */
  private setCanonical(url: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.renderer.createElement('link') as HTMLLinkElement;
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(document.head, link);
    }

    if (link) {
      this.renderer.setAttribute(link, 'href', url);
    }
  }
}
