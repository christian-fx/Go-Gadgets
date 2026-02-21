// src/pages/Account.js
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { store } from '../store.js';

export async function renderAccount() {
  const state = store.getState();
  const user = state.user;

  return `
    ${renderNavbar()}
    <main class="flex-grow bg-gray-50/50 py-10">
      <div class="max-w-7xl mx-auto px-6">
        
        <div class="flex flex-col md:flex-row gap-12">
          <!-- Sidebar -->
          <aside class="w-full md:w-64 flex-shrink-0">
            <!-- User Profile Header -->
            <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
               <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden text-gray-400 flex items-center justify-center">
                 <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
               </div>
               <div>
                  <h3 class="font-bold text-gray-900">${user.name}</h3>
                  <p class="text-xs text-gray-500">${user.email}</p>
               </div>
            </div>

            <nav class="space-y-2">
               <a href="#" class="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                 Dashboard
               </a>
               <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                 Orders
               </a>
               <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 Addresses
               </a>
               <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                 Payment Methods
               </a>
               <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 Account Settings
               </a>
               <hr class="my-4 border-gray-100">
               <a href="#" data-link class="flex items-center gap-3 px-4 py-3 text-[#ff4d4f] hover:bg-red-50 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                 Sign out
               </a>
            </nav>
          </aside>

          <!-- Main Content -->
          <div class="flex-grow">
             <div class="flex justify-between items-start mb-8">
               <div>
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
                  <p class="text-gray-500 user-select-none">Welcome back, ${user.name.split(' ')[0]}</p>
               </div>
               <a href="#" class="text-sm font-medium text-[#0051FF] hover:underline">Need help?</a>
             </div>

             <!-- Recent Orders -->
             <section class="mb-10">
               <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
               <div class="bg-white border text-sm text-gray-600 border-gray-100 rounded-xl shadow-sm overflow-hidden">
                 <table class="w-full text-left">
                   <thead class="bg-gray-50 border-b border-gray-100">
                     <tr>
                       <th class="py-3 px-6 font-medium text-gray-500">Order ID</th>
                       <th class="py-3 px-6 font-medium text-gray-500">Date</th>
                       <th class="py-3 px-6 font-medium text-gray-500 text-center">Status</th>
                       <th class="py-3 px-6 font-medium text-gray-500 text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody class="divide-y text-gray-900 font-medium divide-gray-100">
                     <tr>
                       <td class="py-4 px-6 text-[#0051FF]">#GG-8291</td>
                       <td class="py-4 px-6 text-gray-500">Oct 24, 2024</td>
                       <td class="py-4 px-6 text-center">
                         <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0051FF] text-white">Processing</span>
                       </td>
                       <td class="py-4 px-6 text-right">$349.00</td>
                     </tr>
                     <tr>
                       <td class="py-4 px-6 text-gray-900 font-bold">#GG-7102</td>
                       <td class="py-4 px-6 text-gray-500 font-normal">Sep 12, 2024</td>
                       <td class="py-4 px-6 text-center">
                         <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Delivered</span>
                       </td>
                       <td class="py-4 px-6 text-right font-bold">$129.50</td>
                     </tr>
                      <tr>
                       <td class="py-4 px-6 text-gray-900 font-bold">#GG-6521</td>
                       <td class="py-4 px-6 text-gray-500 font-normal">Aug 05, 2024</td>
                       <td class="py-4 px-6 text-center">
                         <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Delivered</span>
                       </td>
                       <td class="py-4 px-6 text-right font-bold">$899.00</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </section>

             <!-- Sub Sections (Cards) -->
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <!-- Address Card -->
               <div class="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Default Address</h3>
                    <address class="not-italic text-sm text-gray-600 space-y-1 mb-8">
                       <p class="font-medium text-gray-900">${user.name}</p>
                       <p>1200 Innovation Drive, Apt 404</p>
                       <p>San Francisco, CA 94103</p>
                       <p>United States</p>
                    </address>
                  </div>
                  <a href="#" class="text-sm font-medium text-[#0051FF] hover:underline mt-auto">Manage Addresses</a>
               </div>
               
               <!-- Profile Card -->
                <div class="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Personal Profile</h3>
                    <div class="text-sm text-gray-600 space-y-1 mb-8">
                       <p>${user.email}</p>
                       <p>+1 (555) 012-3456</p>
                       <p class="mt-2 text-gray-500 flex items-center gap-2">Password: <span class="tracking-[0.2em]">••••••••••••</span></p>
                    </div>
                  </div>
                  <a href="#" class="text-sm font-medium text-[#0051FF] hover:underline mt-auto">Edit Profile</a>
               </div>
             </div>

          </div>
        </div>
      </div>
    </main>
  `;
}

export function onAccountMount() {
  console.log('Account page mounted');
}
