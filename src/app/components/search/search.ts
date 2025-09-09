import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  template: `
      <!-- Search Panel -->
      <div class="bg-white border-b border-gray-200 shadow-sm">
          <div class="container mx-auto px-6 py-4">
              <div class="flex items-center gap-4">
                  <!-- Search Input -->
                  <div class="flex-1">
                      <div class="p-px bg-gradient-cyan focus-within:ring-2 focus-within:ring-indigo-500 rounded-lg">
                          <input class="w-full px-4 py-3 placeholder-gray-500 text-base text-gray-700 bg-white outline-none rounded-lg"
                                 type="text" placeholder="Search for products, categories, or brands..."/>
                      </div>
                  </div>
                  <!-- Category Combobox -->
                  <div class="min-w-[180px]">
                      <select class="w-full px-4 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="">All Categories</option>
                          <option value="electronics">Electronics</option>
                          <option value="clothing">Clothing</option>
                          <option value="home">Home & Garden</option>
                          <option value="sports">Sports</option>
                          <option value="books">Books</option>
                          <option value="beauty">Beauty</option>
                      </select>
                  </div>
                  <!-- Search Button -->
                  <button class="inline-block group p-0.5 font-heading text-base text-white font-bold bg-gradient-cyan hover:bg-gray-50 overflow-hidden rounded-md">
                      <div class="relative py-3 px-8 bg-gradient-cyan rounded">
                          <div class="absolute top-0 left-0 transform -translate-y-full group-hover:-translate-y-0 h-full w-full bg-white transition ease-in-out duration-500"></div>
                          <span class="relative z-10 group-hover:text-gray-900">Search</span>
                      </div>
                  </button>
                  <!-- Filters Button -->
                  <button class="inline-block group p-0.5 font-heading text-base text-gray-900 font-bold bg-white hover:bg-gray-50 border border-gray-300 overflow-hidden rounded-md">
                      <div class="relative py-3 px-6 bg-white rounded">
                          <div class="absolute top-0 left-0 transform -translate-y-full group-hover:-translate-y-0 h-full w-full bg-gradient-cyan transition ease-in-out duration-500"></div>
                          <span class="relative z-10 group-hover:text-white">Filters</span>
                      </div>
                  </button>
              </div>
              <!-- Quick Search Tags -->
              <div class="mt-3 flex items-center gap-3">
                  <span class="text-sm text-gray-600 font-medium">Popular:</span>
                  <div class="flex flex-wrap gap-2"><a href="#"
                                                       class="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200">Electronics</a><a
                          href="#"
                          class="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200">Clothing</a><a
                          href="#"
                          class="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200">Home
                      & Garden</a><a href="#"
                                     class="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200">Sports</a>
                  </div>
              </div>
          </div>
      </div>
  `
})
export class Search {

}
