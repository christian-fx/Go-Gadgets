// src/components/Features.js
export function renderFeatures() {
    return `
    <section class="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-gray-50 p-8 flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Workspace Setup" class="w-full h-full object-cover rounded-xl shadow-md">
      </div>
      <div class="space-y-10">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose GO GADGETS?</h2>
          <p class="text-gray-500 max-w-md">
            We curate only the finest tech to elevate your daily workflow.
          </p>
        </div>
        
        <div class="space-y-8">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-[#00c5df]/10 text-[#00c5df] flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-1">Official Warranty</h3>
              <p class="text-sm text-gray-500">All products come with a 1-year comprehensive manufacturer warranty.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-[#00c5df]/10 text-[#00c5df] flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-1">Fast Shipping</h3>
              <p class="text-sm text-gray-500">Free express delivery on all orders over $50 across the country.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
