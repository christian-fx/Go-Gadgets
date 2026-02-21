import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import Account from './pages/Account.js';

const routes = {
    '/': Home,
    '/login': Login,
    '/cart': Cart,
    '/checkout': Checkout,
    '/account': Account
};

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

export const router = async () => {
    const path = location.pathname;
    let pageComponent = routes[path] || Home; // fallback to home for now

    const view = document.getElementById('router-view');

    // Clean up old events if needed, but since it's vanilla, we just replace HTML
    view.innerHTML = await pageComponent.render();

    if (pageComponent.afterRender) {
        await pageComponent.afterRender();
    }
};

export const initRouter = () => {
    window.addEventListener('popstate', router);

    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
            e.preventDefault();
            const target = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
            navigateTo(target.href);
        }
    });

    router();
};
