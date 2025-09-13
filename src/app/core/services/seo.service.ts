// seo.service.ts
import { Injectable, inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterStateService } from '@core/services/router-state.service';
import { TenantService, TenantSeoConfig } from '@core/services/tenant.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  // JSON-LD structured data
  jsonLd?: Record<string, any> | Record<string, any>[];
  // Twitter Card specific
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  // Content-specific meta tags
  duration?: number;
  album?: string;
  artist?: string;
  // Venue-specific
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueCountry?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private title = inject(Title);
  private meta = inject(Meta);
  private routerState = inject(RouterStateService);
  private tenantService = inject(TenantService);
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;

  // Fallback values (used if tenant service fails)
  private fallbackKeywords = 'live music, concerts, music venues, open mic, jam sessions, live bands, music events, jazz clubs, rock venues, acoustic nights, Netherlands music, Dutch venues';
  private fallbackSiteName = 'DirectoryHub';
  private fallbackLocale = 'nl_NL';
  private fallbackImage = '/assets/images/default-og-image.jpg';

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /** Set meta tags dynamically with tenant support */
  async setMeta(data: SeoData) {
    // Try to get tenant config, but don't fail if it doesn't load
    let config: TenantSeoConfig | null = null;
    try {
      config = await firstValueFrom(this.tenantService.getTenantSeoConfig());
    } catch (error) {
      console.warn('Failed to load tenant config, using fallback values:', error);
    }

    const fullUrl = this.buildFullUrl(data.url, config);
    const finalTitle = this.buildTitle(data.title, config);
    const finalKeywords = this.buildKeywords(data.keywords, config);
    const finalImage = data.image || (config?.defaultImage || this.fallbackImage);

    // Basic meta tags
    this.setBasicMeta(finalTitle, data.description, finalKeywords);

    // Open Graph tags
    this.setOpenGraphTags({
      ...data,
      title: finalTitle,
      url: fullUrl,
      image: finalImage
    }, config);

    // Twitter Card tags
    this.setTwitterCardTags({
      ...data,
      title: finalTitle,
      image: finalImage
    }, config);

    // Content-specific meta tags
    this.setSpecificMetaTags(data);

    // Set canonical URL
    this.setCanonicalUrl(fullUrl);

    // Handle JSON-LD structured data
    if (data.jsonLd) {
      this.setJsonLd(data.jsonLd, fullUrl);
    }

    // Set robots meta tag
    this.setRobotsMeta(data);
  }

  /** Set basic meta tags */
  private setBasicMeta(title: string, description?: string, keywords?: string) {
    if (title) {
      this.title.setTitle(title);
    }

    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }

    if (keywords) {
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    this.meta.updateTag({ 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' });
  }

  /** Set Open Graph tags */
  private setOpenGraphTags(data: SeoData & { title: string; url: string; image: string }, config?: TenantSeoConfig | null) {
    const ogTags = [
      { property: 'og:title', content: data.title },
      { property: 'og:type', content: data.type || 'website' },
      { property: 'og:url', content: data.url },
      { property: 'og:image', content: data.image },
      { property: 'og:site_name', content: data.siteName || config?.siteName || this.fallbackSiteName },
      { property: 'og:locale', content: data.locale || config?.locale || this.fallbackLocale }
    ];

    if (data.description) {
      ogTags.push({ property: 'og:description', content: data.description });
    }

    if (data.author) {
      ogTags.push({ property: 'og:author', content: data.author });
    }

    if (data.publishedTime) {
      ogTags.push({ property: 'article:published_time', content: data.publishedTime });
    }

    if (data.modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: data.modifiedTime });
    }

    // Content-specific OG tags
    if (data.duration) {
      ogTags.push({ property: 'music:duration', content: data.duration.toString() });
    }

    if (data.album) {
      ogTags.push({ property: 'music:album', content: data.album });
    }

    if (data.artist) {
      ogTags.push({ property: 'music:musician', content: data.artist });
    }

    ogTags.forEach(tag => this.meta.updateTag(tag));
  }

  /** Set Twitter Card tags */
  private setTwitterCardTags(data: SeoData & { title: string; image: string }, config?: TenantSeoConfig | null) {
    const twitterTags = [
      { name: 'twitter:card', content: data.twitterCard || 'summary_large_image' },
      { name: 'twitter:title', content: data.title },
      { name: 'twitter:image', content: data.image }
    ];

    if (data.description) {
      twitterTags.push({ name: 'twitter:description', content: data.description });
    }

    if (data.twitterSite || config?.twitterSite) {
      twitterTags.push({ name: 'twitter:site', content: data.twitterSite || config!.twitterSite! });
    }

    if (data.twitterCreator) {
      twitterTags.push({ name: 'twitter:creator', content: data.twitterCreator });
    }

    twitterTags.forEach(tag => this.meta.updateTag(tag));
  }

  /** Set venue/content specific meta tags */
  private setSpecificMetaTags(data: SeoData) {
    if (data.venueName) {
      this.meta.updateTag({ name: 'venue:name', content: data.venueName });
    }

    if (data.venueAddress) {
      this.meta.updateTag({ name: 'venue:address', content: data.venueAddress });
    }

    if (data.venueCity) {
      this.meta.updateTag({ name: 'venue:city', content: data.venueCity });
    }

    if (data.venueCountry) {
      this.meta.updateTag({ name: 'venue:country', content: data.venueCountry });
    }
  }

  /** Set canonical URL */
  private setCanonicalUrl(url: string) {
    // Remove existing canonical link
    const existingLink = this.document.querySelector("link[rel='canonical']");
    if (existingLink) {
      existingLink.remove();
    }

    // Create new canonical link
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'canonical');
    this.renderer.setAttribute(link, 'href', url);
    this.renderer.appendChild(this.document.head, link);
  }

  /** Handle JSON-LD structured data */
  private setJsonLd(jsonLd: Record<string, any> | Record<string, any>[], fullUrl?: string) {
    // Remove existing JSON-LD scripts
    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Handle array of JSON-LD objects
    const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

    jsonLdArray.forEach(data => {
      // Always add URL for WebSite schema
      if (data['@type'] === 'WebSite' && fullUrl) {
        data.url = fullUrl;
      }

      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data, null, 2);
      this.document.head.appendChild(script);
    });
  }

  /** Set robots meta tag */
  private setRobotsMeta(data: SeoData) {
    let robotsContent = 'index,follow';

    const currentUrl = data.url || this.routerState.$url();

    if (currentUrl.includes('search=') ||
      currentUrl.includes('page=') && this.getPageNumber(currentUrl) > 5) {
      robotsContent = 'noindex,follow';
    }

    this.meta.updateTag({ name: 'robots', content: robotsContent });
  }

  /** Build full URL with domain */
  private buildFullUrl(relativePath?: string, config?: TenantSeoConfig | null): string {
    const path = relativePath || this.routerState.$url();
    const baseUrl = this.getBaseUrl(config);
    return `${baseUrl}${path}`;
  }

  /** Build optimized title */
  private buildTitle(title?: string, config?: TenantSeoConfig | null): string {
    const siteName = config?.siteName || this.fallbackSiteName;

    if (!title) {
      return `${siteName} - Live Music Directory Netherlands`;
    }

    if (title.length > 40) {
      return title;
    }

    return `${title} | ${siteName}`;
  }

  /** Build keywords string */
  private buildKeywords(keywords?: string, config?: TenantSeoConfig | null): string {
    const tenantKeywords = config?.defaultKeywords.join(', ') || this.fallbackKeywords;
    return keywords ? `${keywords}, ${tenantKeywords}` : tenantKeywords;
  }

  /** Get base URL for the site */
  private getBaseUrl(config?: TenantSeoConfig | null): string {
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR, prioritize environment URL, then tenant domain, then fallback
      return environment.siteUrl || (config?.domain ? `https://${config.domain}` : 'https://localhost');
    }
    return `${this.document.location.protocol}//${this.document.location.host}`;
  }

  /** Extract page number from URL */
  private getPageNumber(url: string): number {
    const pageMatch = url.match(/[?&]page=(\d+)/);
    return pageMatch ? parseInt(pageMatch[1], 10) : 1;
  }

  /** Clear all meta tags */
  clearMeta() {
    const tagsToRemove = [
      'name="description"',
      'name="keywords"',
      'property="og:title"',
      'property="og:description"',
      'property="og:image"',
      'property="og:url"',
      'name="twitter:title"',
      'name="twitter:description"',
      'name="twitter:image"'
    ];

    tagsToRemove.forEach(selector => {
      const element = this.document.querySelector(`meta[${selector}]`);
      if (element) {
        element.remove();
      }
    });

    const jsonLdScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => script.remove());

    const canonicalLink = this.document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.remove();
    }
  }
}
