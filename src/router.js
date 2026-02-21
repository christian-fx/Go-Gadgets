// src/router.js
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');

        // Add event listener for browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());
    }

    init() {
        // Intercept link clicks globally
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });
        this.handleRoute();
    }

    navigate(url) {
        window.history.pushState(null, null, url);
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        let routeMatch = this.routes.find(r => r.path === path);

        if (!routeMatch) {
            // Default to 404 or home. Here defaulting to Home if not found.
            routeMatch = this.routes.find(r => r.path === '/');
        }

        try {
            // Render layout outer wrapper (e.g. Navbar)
            // Call the component to render the page
            const content = await routeMatch.component();
            this.appElement.innerHTML = content;

            // After rendering, scroll to top
            window.scrollTo(0, 0);

            // Re-initialize any page specific JS if necessary
            if (routeMatch.onMount) {
                routeMatch.onMount();
            }
        } catch (e) {
            console.error("Router error rendering component", e);
            this.appElement.innerHTML = `<div class="p-10 text-center"><h1 class="text-2xl text-red-500">Error rendering page.</h1></div>`;
        }
    }
}
