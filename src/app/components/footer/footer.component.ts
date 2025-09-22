import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-between -m-6">
          <!-- Logo and Description -->
          <div class="w-full lg:w-1/3 p-6">
            <div class="mb-6">
              <img src="/images/logos/main-logo.svg"
                   alt="GigaWhat.live"
                   class="h-10 w-auto">
            </div>
            <p class="text-gray-400 mb-6">{{ description() }}</p>
          </div>

          <!-- Dynamic Sections -->
          @for (section of footerSections(); track section.title) {
            <div class="w-full sm:w-1/2 lg:w-1/6 p-6">
              <h3 class="font-heading text-lg font-bold text-white mb-4">{{ section.title }}</h3>
              <ul class="space-y-2">
                @for (link of section.links; track link.url) {
                  <li>
                    <a [routerLink]="link.url"
                       class="text-gray-400 hover:text-white">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <div class="border-t border-gray-800 pt-8 mt-8">
          <p class="text-center text-gray-400">{{ copyrightText() }}</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent implements OnInit {
  // Signals for dynamic content
  description = signal('Discover live music venues and entertainment across the Netherlands.');
  copyrightText = signal('© 2025 GigaWhat.live. All rights reserved.');
  footerSections = signal<FooterSection[]>([]);

  ngOnInit(): void {
    this.loadFooterData();
  }

  private loadFooterData(): void {
    // For now, hardcoded data - later replace with service calls
    const sections: FooterSection[] = [
      {
        title: 'Venues',
        links: [
          { label: 'All Venues', url: '/nl/all/venues' },
          { label: 'Amersfoort', url: '/nl/amersfoort/venues' },
          { label: 'Utrecht', url: '/nl/utrecht/venues' }
        ]
      },
      {
        title: 'Cities',
        links: [
          { label: 'Live music in Amersfoort', url: '/nl/amersfoort/about' },
          { label: 'Netherlands venues', url: '/nl' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', url: '/privacy' },
          { label: 'Terms of Service', url: '/terms' },
          { label: 'Contact', url: '/contact' }
        ]
      }
    ];

    this.footerSections.set(sections);
  }

  // Future methods for service integration
  // loadCitiesFromService(): void {
  //   this.cityService.getFeaturedCities().subscribe(cities => {
  //     const cityLinks = cities.map(city => ({
  //       label: `Live music in ${city.name}`,
  //       url: `/nl/${city.slug}`
  //     }));
  //
  //     this.updateSection('Cities', cityLinks);
  //   });
  // }

  // private updateSection(title: string, links: FooterLink[]): void {
  //   this.footerSections.update(sections =>
  //     sections.map(section =>
  //       section.title === title ? { ...section, links } : section
  //     )
  //   );
  // }
}
