// src/components/TrendingNow.js
import { store } from '../store.js';
import { renderProductCard } from './ProductCard.js';

export function renderTrendingNow() {
    const state = store.getState();
    // Grab the first 4 products for trending
    const trendingProducts = state.products.slice(0, 4);

    return `
    <section class="bg-[#f0f9fa] py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Trending Now</h2>
          <div class="flex gap-2">
            <button class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${trendingProducts.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>
  `;
}
