// src/components/Navbar.js
import { store } from '../store.js';

export function renderNavbar() {
  const state = store.getState();
  const cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  return `
    <nav class="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <a href="/" data-link class="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          GO GADGETS
        </a>

        <!-- Desktop Links -->
        <div class="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
          <a href="/store" data-link class="hover:text-gray-900 transition-colors">Store</a>
          <a href="/store" data-link class="hover:text-gray-900 transition-colors">Categories</a>
          <a href="/store" data-link class="hover:text-gray-900 transition-colors">New Arrivals</a>
          <a href="#" class="hover:text-gray-900 transition-colors">Support</a>
        </div>

        <!-- Icons -->
        <div class="flex items-center space-x-6">
          <button class="text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <a href="/cart" data-link class="text-gray-600 hover:text-gray-900 transition-colors relative block">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span id="cart-badge" class="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cartCount > 0 ? '' : 'hidden'}">${cartCount}</span>
          </a>
          <a id="nav-profile-link" href="${state.user.isLoggedIn ? '/account' : '/auth'}" data-link class="text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </a>
        </div>
      </div>
    </nav>
  `;
}
