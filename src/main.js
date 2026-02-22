import { Router } from './router.js';
import { store } from './store.js';
import { renderHome, onHomeMount } from './pages/Home.js';
import { renderStore, onStoreMount } from './pages/Store.js';
import { renderCart, onCartMount } from './pages/Cart.js';
import { renderCheckout, onCheckoutMount } from './pages/Checkout.js';
import { renderAccount, onAccountMount } from './pages/Account.js';
import { renderAuth, onAuthMount } from './pages/Auth.js';
import { renderProduct, onProductMount } from './pages/Product.js';
import './style.css'; // Tailwind CSS entry

// Initialize routing
const routes = [
    { path: '/', component: renderHome, onMount: onHomeMount },
    { path: '/store', component: renderStore, onMount: onStoreMount },
    { path: '/cart', component: renderCart, onMount: onCartMount },
    { path: '/checkout', component: renderCheckout, onMount: onCheckoutMount },
    { path: '/account', component: renderAccount, onMount: onAccountMount },
    { path: '/auth', component: renderAuth, onMount: onAuthMount },
    { path: '/product', component: renderProduct, onMount: onProductMount }
];

const router = new Router(routes);
// Export router to be accessible globally if needed
window.router = router;

store.initAuthListener(() => {
    router.init();
});

// Global Cart UI Updates
store.subscribe((state) => {
    const cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        if (cartCount > 0) {
            badge.textContent = cartCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    const profileLink = document.getElementById('nav-profile-link');
    if (profileLink) {
        profileLink.href = state.user.isLoggedIn ? '/account' : '/auth';
    }
});

// Global "Add to Cart" Handling with visual feedback
document.body.addEventListener('click', (e) => {
    const addToCartBtn = e.target.closest('[data-add-to-cart]');
    if (addToCartBtn) {
        const productId = addToCartBtn.getAttribute('data-add-to-cart');
        const product = store.getState().products.find(p => String(p.id) === String(productId))
            || window.__CURRENT_PRODUCT__; // Fallback for Product.js isolated loads

        if (product) {
            store.dispatch({ type: 'ADD_TO_CART', payload: product });

            const originalText = addToCartBtn.innerHTML;
            addToCartBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        Added
      `;
            addToCartBtn.classList.remove('bg-gray-50', 'text-gray-800');
            addToCartBtn.classList.add('bg-green-500', 'text-white', 'hover:bg-green-600', 'border-green-500');

            // Mini toast at the bottom right
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300 z-[100] text-sm font-medium flex items-center gap-2';
            toast.innerHTML = `
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        Added to cart
      `;
            document.body.appendChild(toast);

            setTimeout(() => {
                addToCartBtn.innerHTML = originalText;
                addToCartBtn.classList.remove('bg-green-500', 'text-white', 'hover:bg-green-600', 'border-green-500');
                addToCartBtn.classList.add('bg-gray-50', 'text-gray-800');

                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 1500);
        }
    }
});
