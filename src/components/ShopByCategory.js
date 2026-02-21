// src/components/ShopByCategory.js
export function renderShopByCategory() {
    const categories = [
        { title: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { title: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { title: 'Wearables', image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
        { title: 'Gaming', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b79?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    ];

    return `
    <section class="max-w-7xl mx-auto px-6 py-16">
      <div class="flex justify-between items-end mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Shop by Category</h2>
        <a href="/store" data-link class="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
          View All Categories
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </a>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        ${categories.map(cat => `
          <a href="/store?category=${cat.title.toLowerCase()}" data-link class="group relative rounded-2xl overflow-hidden aspect-square flex items-end">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
             <img src="${cat.image}" alt="${cat.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out">
             <h3 class="relative z-20 p-4 sm:p-6 text-lg sm:text-xl font-bold text-white tracking-wide">${cat.title}</h3>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}
