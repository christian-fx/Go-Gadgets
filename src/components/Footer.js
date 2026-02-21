// src/components/Footer.js
export function renderFooter() {
    return `
    <footer class="bg-white border-t border-gray-100 py-16 px-6 mt-auto">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="col-span-1">
          <div class="text-xl font-bold tracking-tight text-gray-900 mb-4">GO GADGETS</div>
          <p class="text-sm text-gray-500 leading-relaxed max-w-xs">
            Premium electronics and gadgets for the modern enthusiast. Quality you can trust, technology you can feel.
          </p>
        </div>

        <!-- Links -->
        <div class="col-span-1">
          <h4 class="font-semibold text-gray-900 mb-6 font-sm">Shop</h4>
          <ul class="space-y-4 text-sm text-gray-500">
            <li><a href="/store" data-link class="hover:text-gray-900">All Products</a></li>
            <li><a href="/store" data-link class="hover:text-gray-900">New Arrivals</a></li>
            <li><a href="/store" data-link class="hover:text-gray-900">Featured</a></li>
            <li><a href="/store" data-link class="hover:text-gray-900">Deals</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div class="col-span-1">
          <h4 class="font-semibold text-gray-900 mb-6 font-sm">Support</h4>
          <ul class="space-y-4 text-sm text-gray-500">
            <li><a href="#" class="hover:text-gray-900">Help Center</a></li>
            <li><a href="#" class="hover:text-gray-900">Returns</a></li>
            <li><a href="#" class="hover:text-gray-900">Warranty</a></li>
            <li><a href="#" class="hover:text-gray-900">Contact Us</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="col-span-1">
          <h4 class="font-semibold text-gray-900 mb-6 font-sm">Stay Updated</h4>
          <p class="text-sm text-gray-500 mb-4">Subscribe for exclusive offers.</p>
          <form class="flex w-full" onsubmit="event.preventDefault();">
            <input type="email" placeholder="Email address" class="w-full border border-gray-200 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-r-md font-medium transition-colors">Join</button>
          </form>
        </div>
      </div>
    </footer>
  `;
}
