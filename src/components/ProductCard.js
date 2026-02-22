// src/components/ProductCard.js
export function renderProductCard(product) {
  return `
    <div class="bg-white group overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <a href="/product?id=${product.id}" data-link class="relative block aspect-square bg-gray-50 flex items-center justify-center overflow-hidden p-6">
        ${product.badge ? `<div class="absolute top-3 left-3 bg-blue-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm z-10">${product.badge}</div>` : ''}
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500">
      </a>
      <div class="p-5 flex flex-col items-center flex-grow">
        <a href="/product?id=${product.id}" data-link class="text-sm font-semibold text-gray-900 text-center truncate w-full hover:text-[#00c5df] transition-colors">${product.name}</a>
        <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-1 mb-2">${product.category}</p>
        <div class="flex items-center gap-2 mb-4 mt-auto">
          <span class="text-sm font-bold text-[#00c5df]">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="text-xs text-gray-400 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <button data-add-to-cart="${product.id}" ${product.stock === 0 ? 'disabled' : ''} class="w-full py-2 ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100' : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'} text-sm font-medium rounded border transition-colors flex items-center justify-center gap-2">
          ${product.stock === 0 ? '' : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`}
          ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  `;
}
