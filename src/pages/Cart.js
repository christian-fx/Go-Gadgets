// src/pages/Cart.js
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { store } from '../store.js';

export async function renderCart() {
  const state = store.getState();
  const cart = state.cart;

  if (cart.length === 0) {
    return `
      ${renderNavbar()}
      <main class="flex-grow bg-gray-50 flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-6">Looks like you haven't added any items to the cart yet.</p>
          <a href="/store" data-link class="bg-[#00c5df] hover:bg-[#00a9bf] text-white px-6 py-3 rounded-md font-medium transition-colors">Start Shopping</a>
        </div>
      </main>
      ${renderFooter()}
    `;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% dummy tax
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return `
    ${renderNavbar()}
    <main class="flex-grow bg-gray-50/50 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
        <p class="text-sm text-gray-500 mb-8">${itemCount} items in your bag • Free shipping eligible</p>

        <div class="flex flex-col lg:flex-row gap-12">
          
          <!-- Cart Items -->
          <div class="flex-grow space-y-6">
            ${cart.map(item => {
    const specsString = item.specs ? (Array.isArray(item.specs) ? item.specs.map(s => s.value).join(', ') : Object.values(item.specs).join(', ')) : (item.description || item.category || '');
    const displayDesc = specsString.length > 50 ? specsString.substring(0, 47) + '...' : specsString;
    return `
              <div class="bg-white p-6 rounded-xl border border-gray-100 flex gap-6 items-start shadow-sm">
                <div class="w-24 h-24 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden p-2">
                  <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain">
                </div>
                <div class="flex-grow flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <h3 class="font-bold text-gray-900">${item.name}</h3>
                    <p class="text-sm text-gray-500 mt-1 max-w-sm line-clamp-2">${displayDesc}</p>
                    <div class="mt-4 flex items-center gap-4">
                       <div class="flex items-center border border-gray-200 rounded">
                         <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors" data-action="decrement" data-id="${item.id}">-</button>
                         <span class="w-10 text-center text-sm font-medium text-gray-900">${item.quantity}</span>
                         <button class="w-8 h-8 flex items-center justify-center ${item.stock !== undefined && item.quantity >= item.stock ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'} transition-colors" data-action="${item.stock !== undefined && item.quantity >= item.stock ? '' : 'increment'}" data-id="${item.id}">+</button>
                       </div>
                    </div>
                  </div>
                  <div class="flex flex-col justify-between items-end">
                    <span class="font-bold text-gray-900 text-lg">$${item.price.toFixed(2)}</span>
                    <button class="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors mt-auto" data-action="remove" data-id="${item.id}">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            `;
  }).join('')}
          </div>

          <!-- Order Summary -->
          <div class="w-full lg:w-96 flex-shrink-0">
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h3 class="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div class="space-y-4 mb-6 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Subtotal</span>
                  <span class="font-medium text-gray-900">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Shipping Estimate</span>
                  <span class="font-medium text-green-600">Free</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Tax (Estimated)</span>
                  <span class="font-medium text-gray-900">$${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div class="border-t border-gray-100 pt-4 mb-6">
                 <div class="flex justify-between items-center">
                  <span class="font-bold text-gray-900">Total</span>
                  <span class="font-bold text-xl text-gray-900">$${total.toFixed(2)}</span>
                </div>
              </div>

              <div class="flex gap-2 mb-6">
                <input type="text" placeholder="Promo code" class="flex-grow border border-gray-200 rounded py-2 px-3 text-sm focus:outline-none focus:border-[#00c5df]">
                <button class="px-4 py-2 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">Apply</button>
              </div>
              
              <a href="/checkout" data-link class="block w-full bg-[#0051FF] hover:bg-[#0040CC] text-white text-center py-3 rounded-md font-medium transition-colors mb-4">
                Proceed to Checkout
              </a>
              <div class="flex items-center justify-center gap-2 text-xs text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}

export function onCartMount() {
  const container = document.querySelector('main');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    const item = store.getState().cart.find(i => String(i.id) === String(id));

    if (item) {
      if (action === 'increment') {
        store.dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: item.quantity + 1 } });
        window.router.handleRoute(); // re-render
      } else if (action === 'decrement') {
        store.dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: item.quantity - 1 } });
        window.router.handleRoute(); // re-render
      } else if (action === 'remove') {
        store.dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
        window.router.handleRoute(); // re-render
      }
    }
  });
}
