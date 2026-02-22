// src/components/ShopByCategory.js
export function renderShopByCategory(categories = []) {
  const defaultCategories = [
    { title: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { title: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { title: 'Wearables', image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { title: 'Gaming', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b79?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
  ];

  // Only use up to 4 categories for the home page UI grid
  const displayCats = categories.length > 0 ? categories.slice(0, 4) : defaultCategories;

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
        ${displayCats.map(cat => {
    const title = cat.title || cat.name || 'Category';
    const image = cat.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
    // Simple mapping to decide icon based on title
    let icon = 'interests';
    const t = title.toLowerCase();
    if (t.includes('smartphones') || t.includes('phone')) icon = 'smartphone';
    else if (t.includes('audio') || t.includes('sound')) icon = 'headphones';
    else if (t.includes('wearable') || t.includes('watch')) icon = 'watch';
    else if (t.includes('game') || t.includes('gaming')) icon = 'sports_esports';
    else if (t.includes('drone') || t.includes('camera')) icon = 'photo_camera';
    else if (t.includes('smart home')) icon = 'home_iot';

    return `
              <a href="/store?category=${title.toLowerCase()}" data-link class="group relative rounded-2xl overflow-hidden aspect-square flex items-end">
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                 <img src="${image}" alt="${title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out">
                 <div class="relative z-20 p-4 sm:p-6 w-full flex flex-col gap-2">
                    <span class="material-symbols-outlined text-white text-3xl mb-1">${icon}</span>
                    <h3 class="text-lg sm:text-xl font-bold text-white tracking-wide">${title}</h3>
                 </div>
              </a>
            `;
  }).join('')}
      </div>
    </section>
  `;
}
