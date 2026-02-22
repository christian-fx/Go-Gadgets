// src/pages/Home.js
import { renderNavbar } from '../components/Navbar.js';
import { renderHero } from '../components/Hero.js';
import { renderShopByCategory } from '../components/ShopByCategory.js';
import { renderTrendingNow } from '../components/TrendingNow.js';
import { renderFeatures } from '../components/Features.js';
import { renderFooter } from '../components/Footer.js';
import { store } from '../store.js';
import { db } from '../api/firebase-config.js';
import { collection, getDocs } from "firebase/firestore";

export async function renderHome() {
    // Ensure products are loaded for TrendingNow to use
    let state = store.getState();
    let categories = [];
    if (state.products.length === 0) {
        try {
            const snapshot = await getDocs(collection(db, "products"));
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            store.dispatch({ type: 'SET_PRODUCTS', payload: fetched });
        } catch (e) {
            console.error("Failed to fetch products for home", e);
        }
    }

    // Fetch categories for ShopByCategory
    try {
        const catSnap = await getDocs(collection(db, "categories"));
        categories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Failed to fetch categories for home", e);
    }

    return `
    ${renderNavbar()}
    <main class="flex-grow">
      ${renderHero()}
      ${renderShopByCategory(categories)}
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
            const productId = e.currentTarget.getAttribute('data-add-to-cart');
            const product = store.getState().products.find(p => String(p.id) === String(productId));
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
