// src/pages/Store.js
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { renderProductCard } from '../components/ProductCard.js';
import { store } from '../store.js';
import { db } from '../api/firebase-config.js';
import { collection, onSnapshot, getDocs } from "firebase/firestore";

let allProducts = [];
let unsubscribeProducts = null;
let currentCategoryFilter = 'All';

// 1. Fetch Categories
async function loadCategories() {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Failed to load categories:", e);
    return [];
  }
}

// 2. Fetch Products (Real-time)
function initStore(renderCallback) {
  if (unsubscribeProducts) unsubscribeProducts();
  unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
    allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    store.dispatch({ type: 'SET_PRODUCTS', payload: allProducts }); // Sync global store
    renderCallback(filterByCategory(currentCategoryFilter));
  });
}

// 3. Filter Logic
function filterByCategory(categoryName) {
  if (categoryName === 'All') return allProducts;
  return allProducts.filter(p => p.category === categoryName);
}

export async function renderStore() {
  const categories = await loadCategories();
  // Default mock categories if DB is empty
  const displayCats = categories.length > 0 ? categories : [
    { id: '1', name: 'Smartphones' },
    { id: '2', name: 'Audio' },
    { id: '3', name: 'Wearables' },
    { id: '4', name: 'Gaming' },
    { id: '5', name: 'Cameras' },
    { id: '6', name: 'Smart Home' }
  ];

  return `
    ${renderNavbar()}
    <main class="flex-grow bg-white">
      <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- Top Bar -->
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <p class="text-sm text-gray-500">Showing All products</p>
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
            <div class="mb-8">
              <h3 class="font-bold text-gray-900 mb-4">Categories</h3>
              <div class="space-y-3" id="category-filters">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="categoryFilter" value="All" checked class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                  <span class="text-sm font-medium text-gray-900">All Products</span>
                </label>
                ${displayCats.map(cat => `
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="categoryFilter" value="${cat.name}" class="w-4 h-4 text-[#00c5df] rounded border-gray-300 focus:ring-[#00c5df]">
                    <span class="text-sm text-gray-600 hover:text-gray-900">${cat.name}</span>
                  </label>
                `).join('')}
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
              <div class="col-span-full py-12 text-center text-gray-500">
                <svg class="animate-spin h-8 w-8 mx-auto text-[#00c5df] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p>Loading products...</p>
              </div>
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
  const gridContainer = document.getElementById('store-product-grid');

  // Callback to update Grid
  const updateGrid = (productsToRender) => {
    if (!gridContainer) return;

    if (productsToRender.length === 0) {
      gridContainer.innerHTML = `<div class="col-span-full py-12 text-center text-gray-500">No products found for this category.</div>`;
      return;
    }

    gridContainer.innerHTML = productsToRender.map(p => renderProductCard(p)).join('');
  };

  // Initialize Firebase listener
  initStore(updateGrid);

  // Filter Logic Binding
  const categoryRadios = document.querySelectorAll('input[name="categoryFilter"]');
  categoryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentCategoryFilter = e.target.value;
      updateGrid(filterByCategory(currentCategoryFilter));
    });
  });

  // Add To Cart events are now handled globally in main.js, so we don't need to bind them here anymore.
}
