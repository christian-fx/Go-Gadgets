// src/pages/Checkout.js
import { store } from '../store.js';

export async function renderCheckout() {
    const state = store.getState();
    const cart = state.cart;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (cart.length === 0) {
        return `<script>window.location.href="/cart";</script>`;
    }

    return `
    <div class="min-h-screen bg-white flex flex-col md:flex-row">
      <!-- Left Column: Form -->
      <div class="flex-grow pt-10 px-6 md:px-12 lg:px-24">
        <!-- Minimal Header -->
        <header class="flex items-center justify-between border-b pb-6 mb-8">
          <a href="/" data-link class="text-xl font-bold text-gray-900 tracking-tight">GO GADGETS</a>
          <div class="text-xs text-gray-500 font-medium tracking-wide border px-2 py-1 rounded bg-gray-50 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Secure Checkout
          </div>
        </header>

        <!-- Breadcrumbs -->
        <nav class="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <a href="/cart" data-link class="text-[#0051FF] hover:underline">Cart</a>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="font-medium text-gray-900">Information</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="text-gray-400 cursor-not-allowed">Shipping</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="text-gray-400 cursor-not-allowed">Payment</span>
        </nav>

        <form>
          <!-- Contact Info -->
          <section class="mb-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
              <p class="text-sm text-gray-600">Already have an account? <a href="/account" class="text-[#0051FF] hover:underline font-medium">Log in</a></p>
            </div>
             <div class="mb-4">
                <input type="email" placeholder="Email address" value="you@example.com" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
             </div>
             <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="w-4 h-4 text-[#0051FF] rounded border-gray-300 focus:ring-[#0051FF]">
              <span class="text-sm text-gray-600">Email me with news and offers</span>
             </label>
          </section>

          <!-- Shipping Address -->
          <section class="mb-10">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div class="space-y-4">
              <div>
                <select class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF] text-gray-700 bg-white">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First name" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                <input type="text" placeholder="Last name" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
              </div>
              <input type="text" placeholder="Address, apartment, suite, etc." class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
              <div class="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                <select class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF] text-gray-700 bg-white">
                  <option>State</option>
                  <option>CA</option>
                  <option>NY</option>
                </select>
                <input type="text" placeholder="ZIP code" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
              </div>
              <input type="tel" placeholder="(555) 555-5555" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
            </div>
            <div class="mt-6">
               <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked class="w-4 h-4 text-[#0051FF] rounded border-gray-300 focus:ring-[#0051FF]">
                <span class="text-sm text-gray-600">Save this information for next time</span>
               </label>
            </div>
          </section>

          <!-- Actions -->
          <div class="flex justify-between items-center py-6">
            <a href="/cart" data-link class="text-[#0051FF] hover:underline text-sm font-medium flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Return to cart
            </a>
            <button type="button" class="bg-[#0051FF] hover:bg-[#0040CC] px-6 py-3 rounded text-white font-medium transition-colors" onclick="alert('Proceeding to dummy shipping phase')">Continue to shipping</button>
          </div>
        </form>
      </div>

      <!-- Right Column: Order Summary Side Panel -->
      <div class="w-full md:w-5/12 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
         <div class="sticky top-0 pt-10 px-6 md:px-10 pb-10">
            <!-- Items -->
            <div class="space-y-4 mb-8">
              ${cart.map(item => `
                <div class="flex items-center justify-between gap-4">
                  <div class="relative w-16 h-16 rounded border border-gray-200 bg-white shadow-sm flex-shrink-0">
                    <img src="${item.image}" alt="" class="w-full h-full object-cover rounded">
                    <span class="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">${item.quantity}</span>
                  </div>
                  <div class="flex-grow">
                    <h4 class="text-sm font-medium text-gray-900">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.category}</p>
                  </div>
                  <div class="font-medium text-sm text-gray-900">
                    $${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Totals -->
            <div class="border-t border-gray-200 py-6 space-y-3">
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500">Subtotal</span>
                 <span class="text-gray-900 font-medium">$${subtotal.toFixed(2)}</span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500">Shipping</span>
                 <span class="text-gray-500 text-xs text-right">Calculated at next step</span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500">Estimated Taxes</span>
                 <span class="text-gray-900 font-medium">$${tax.toFixed(2)}</span>
               </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <div class="flex justify-between items-center">
                 <span class="text-lg text-gray-900 font-bold">Total</span>
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-500 font-medium tracking-wide">USD</span>
                   <span class="text-2xl font-bold text-gray-900">$${total.toFixed(2)}</span>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  `;
}

export function onCheckoutMount() {
    console.log('Checkout page mounted');
}
