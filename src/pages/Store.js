// src/pages/Store.js
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { renderProductCard } from '../components/ProductCard.js';
import { store } from '../store.js';

export async function renderStore() {
    const state = store.getState();
    const products = state.products;

    return `
    ${renderNavbar()}
    <main class="flex-grow bg-white">
      <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- Top Bar -->
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <p class="text-sm text-gray-500">Showing ${products.length} products</p>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Sort by:</label>
            <select class="text-sm border-none bg-transparent focus:ring-0 cursor-pointer font-medium text-gray-900 pr-8">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-10">
          <!-- Sidebar -->
          <aside class="w-full md:w-64 flex-shrink-0">
            <!-- Categories -->
            <div class="mb-8">
              <h3 class="font-bold text-gray-900 mb-4">Categories</h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-[#00c5df] font-medium">All Products</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-600 hover:text-gray-900">Smartphones</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-600 hover:text-gray-900">Audio & Sound</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-600 hover:text-gray-900">Wearables</span>
                </label>
                 <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-600 hover:text-gray-900">Gaming</span>
                </label>
                 <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-600 hover:text-gray-900">Cameras & Drones</span>
                </label>
                 <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-600 hover:text-gray-900">Smart Home</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-8">
              <h3 class="font-bold text-gray-900 mb-4">Price Range</h3>
              <div class="px-2 mb-4">
                 <input type="range" class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm">
                 <div class="relative w-full h-1 bg-[#00c5df] rounded-lg -mt-1" style="width: 100%;"></div>
              </div>
              <div class="flex items-center gap-4">
                <div class="relative w-full">
                  <span class="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                  <input type="number" value="100" class="w-full border border-gray-200 rounded-md py-2 pl-6 pr-2 text-sm focus:outline-none focus:border-[#00c5df]">
                </div>
                <span class="text-gray-400">-</span>
                <div class="relative w-full">
                  <span class="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                  <input type="number" value="1200" class="w-full border border-gray-200 rounded-md py-2 pl-6 pr-2 text-sm focus:outline-none focus:border-[#00c5df]">
                </div>
              </div>
            </div>

            <!-- Brands -->
            <div class="mb-8">
              <h3 class="font-bold text-gray-900 mb-4">Brands</h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-700">Sonic</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-700">Vision</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-700">SkyStream</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm text-gray-700">Echo</span>
                </label>
              </div>
            </div>
          </aside>

          <!-- Product Grid -->
          <div class="flex-grow">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" id="store-product-grid">
              ${products.map(p => renderProductCard(p)).join('')}
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-center items-center gap-2">
              <button class="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button class="w-10 h-10 rounded bg-[#00c5df] text-white font-medium flex items-center justify-center">1</button>
              <button class="w-10 h-10 rounded border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors font-medium flex items-center justify-center">2</button>
              <button class="w-10 h-10 rounded border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors font-medium flex items-center justify-center">3</button>
              <span class="text-gray-400 mx-2">...</span>
              <button class="w-10 h-10 rounded border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors font-medium flex items-center justify-center">8</button>
              <button class="w-10 h-10 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}

export function onStoreMount() {
    const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-add-to-cart'));
            const product = store.getState().products.find(p => p.id === productId);
            if (product) {
                store.dispatch({ type: 'ADD_TO_CART', payload: product });
                document.getElementById('app').innerHTML += `<div class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow transition-opacity duration-300 z-[100]" id="toast">Added to cart!</div>`;
                setTimeout(() => {
                    const toast = document.getElementById('toast');
                    if (toast) toast.remove();
                }, 2000);
            }
        });
    });
}
