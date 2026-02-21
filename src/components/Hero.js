// src/components/Hero.js
export function renderHero() {
    return `
    <section class="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <div class="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-wider">New Release 2026</div>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
          The Future of Tech is Here.
        </h1>
        <p class="text-lg text-gray-500 leading-relaxed max-w-lg">
          Experience the next generation of smart devices. Designed for performance, built for style. Upgrade your digital life today.
        </p>
        <div class="flex items-center gap-4 pt-4">
          <a href="/store" data-link class="bg-[#00c5df] hover:bg-[#00a9bf] text-white px-8 py-3 rounded-md font-medium transition-colors shadow-sm">Shop Now</a>
          <button class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md font-medium transition-colors shadow-sm flex items-center gap-2">
            Watch Video
          </button>
        </div>
      </div>
      <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
        <!-- Using a placeholder tech hero image from unsplash -->
        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Tech Gadgets Setup" class="w-full h-full object-cover">
      </div>
    </section>
  `;
}
