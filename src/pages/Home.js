// src/pages/Home.js
import { renderNavbar } from '../components/Navbar.js';
import { renderHero } from '../components/Hero.js';
import { renderShopByCategory } from '../components/ShopByCategory.js';
import { renderTrendingNow } from '../components/TrendingNow.js';
import { renderFeatures } from '../components/Features.js';
import { renderFooter } from '../components/Footer.js';
import { store } from '../store.js';

export async function renderHome() {
    return `
    ${renderNavbar()}
    <main class="flex-grow">
      ${renderHero()}
      ${renderShopByCategory()}
      ${renderTrendingNow()}
      ${renderFeatures()}
    </main>
    ${renderFooter()}
  `;
}

export function onHomeMount() {
    // Logic to handle Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-add-to-cart'));
            const product = store.getState().products.find(p => p.id === productId);
            if (product) {
                store.dispatch({ type: 'ADD_TO_CART', payload: product });
                // Optional: show a mini toast or re-render Navbar
                document.getElementById('app').innerHTML = `<div class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow transition-opacity duration-300 z-[100]" id="toast">Added to cart!</div>` + document.getElementById('app').innerHTML;
                setTimeout(() => {
                    const toast = document.getElementById('toast');
                    if (toast) toast.remove();
                }, 2000);
            }
        });
    });
}
