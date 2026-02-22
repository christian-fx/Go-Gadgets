// src/pages/Product.js
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { store } from '../store.js';
import { db } from '../api/firebase-config.js';
import { doc, getDoc } from "firebase/firestore";

export async function renderProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  let product = null;

  try {
    if (productId) {
      const docRef = doc(db, "products", productId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        product = { id: snap.id, ...snap.data() };
      }
    }
  } catch (error) {
    console.error("Error loading product:", error);
  }

  if (!product) {
    return `
            ${renderNavbar()}
            <main class="flex-grow bg-[#FAFBFF] py-20 flex items-center justify-center">
              <div class="text-center">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <p class="text-gray-500 mb-8">We couldn't find the product you're looking for.</p>
                <a href="/store" data-link class="px-6 py-3 bg-[#00BCD4] text-white font-bold rounded-xl hover:bg-[#0097A7] transition">Back to Store</a>
              </div>
            </main>
            ${renderFooter()}
        `;
  }

  // Expose for main.js add to cart handler
  window.__CURRENT_PRODUCT__ = product;

  const isOutOfStock = product.stock === 0;

  return `
    ${renderNavbar()}
    <main class="flex-grow bg-[#FAFBFF] py-10">
      <div class="max-w-7xl mx-auto px-6">
        
        <!-- Breadcrumbs -->
        <nav class="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <a href="/store" data-link class="hover:text-gray-900 transition-colors">Store</a>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <a href="/store?category=${product.category.toLowerCase()}" data-link class="hover:text-gray-900 transition-colors">${product.category}</a>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="font-medium text-gray-900">${product.name}</span>
        </nav>

        <div class="flex flex-col lg:flex-row gap-16 mb-24">
          <!-- Left Column (w-1/2): Large Product Image -->
          <div class="w-full lg:w-1/2">
             <div class="bg-white border text-sm text-gray-600 border-gray-100 rounded-xl shadow-sm overflow-hidden aspect-[4/3] flex items-center justify-center p-8">
               <img src="${product.image || product.imageUrl || 'https://via.placeholder.com/600'}" alt="${product.name}" class="w-full h-full object-contain hover:scale-105 transition-transform duration-500">
             </div>
          </div>

          <!-- Right Column (w-1/2): Details, Cart, Features, Specs -->
          <div class="w-full lg:w-1/2">
             ${product.badge ? `<span class="inline-block px-3 py-1 bg-[#E0F7FA] text-[#00838F] text-xs font-bold rounded-full mb-4 tracking-wide">${product.badge}</span>` : ''}
             <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">${product.name}</h1>
             
             <div class="flex items-baseline gap-3 mb-6">
               <span class="text-3xl font-bold text-[#00c5df]">$${product.price.toFixed(2)}</span>
               ${product.originalPrice ? `<span class="text-lg text-gray-400 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
             </div>
             
             <p class="text-gray-500 leading-relaxed mb-8">
               ${product.description || 'No description available for this product.'}
             </p>

             <div class="mb-10 pb-10 border-b border-gray-100">
                <button data-add-to-cart="${product.id}" id="addToCartBtn" ${isOutOfStock ? 'disabled' : ''} class="w-full py-4 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0051FF] hover:bg-[#0040CC]'}">
                  ${!isOutOfStock ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>` : ''}
                  ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
             </div>

             <!-- Specifications Container -->
             <div id="specsContainer" class="${(!product.specifications || Object.keys(product.specifications).length === 0) ? 'hidden' : ''}">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                <div id="productSpecs" class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                   <table class="min-w-full text-sm text-left">
                     <tbody class="divide-y divide-gray-100">
                       ${product.specifications ? (Array.isArray(product.specifications)
      ? product.specifications.map(s => `
                            <tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4 font-medium text-slate-500 w-1/3">${s.key || s.name}</td><td class="px-6 py-4 text-slate-900">${s.value}</td></tr>
                          `).join('')
      : Object.entries(product.specifications).map(([key, value]) => `
                            <tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4 font-medium text-slate-500 w-1/3">${key}</td><td class="px-6 py-4 text-slate-900">${value}</td></tr>
                          `).join('')) : ''}
                     </tbody>
                   </table>
                </div>
             </div>

          </div>
        </div>

        <!-- Features Container -->
        <div id="featuresContainer" class="${(!product.features || product.features.length === 0) ? 'hidden' : 'mb-24'}">
           <h3 class="text-2xl font-bold text-gray-900 mb-8 pt-8 border-t border-gray-100">Key Features</h3>
           <div id="productFeatures" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             ${product.features ? product.features.map(f => `
               <div class="bg-white border text-sm text-gray-600 border-gray-100 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                   <span class="font-medium">${f}</span>
               </div>
             `).join('') : ''}
           </div>
        </div>
    </main>
    ${renderFooter()}
  `;
}

export function onProductMount() {
  // Product page initialized
}
