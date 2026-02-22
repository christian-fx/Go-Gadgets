// src/pages/Account.js
import { renderNavbar } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { store } from '../store.js';
import { db, auth } from '../api/firebase-config.js';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";

export async function renderAccount() {
  const state = store.getState();
  const user = state.user;

  // Protect Route
  if (!user.isLoggedIn) {
    setTimeout(() => window.router.navigate('/auth'), 0);
    return `<div class="min-h-screen flex items-center justify-center bg-gray-50"><p class="text-gray-500">Redirecting to login...</p></div>`;
  }

  // Fallback name if missing
  const displayName = user.name || 'User';

  let ordersHtml = `
     <div class="bg-white border text-sm text-gray-600 border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center py-12 px-4 text-center">
       <svg class="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
       <p class="text-gray-900 font-semibold mb-1">No Orders Yet</p>
       <p class="text-gray-500 max-w-sm">When you place orders, they will appear here so you can track their status.</p>
       <a href="/store" data-link class="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Start Shopping</a>
     </div>
  `;
  let paymentHtml = `<p>You haven't added any payment methods yet.</p>`;
  let addressHtml = `<p>You haven't saved any addresses yet.</p>`;

  try {
    if (user.uid) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();

        // Render Addresses Array
        if (data.addresses && data.addresses.length > 0) {
          addressHtml = data.addresses.map(addr => `
            <div class="mb-4 bg-gray-50 border border-gray-100 rounded p-3 relative group">
              <p class="font-medium text-gray-900">${data.name || displayName}</p>
              <p>${addr.street}</p>
              <p>${addr.city}, ${addr.state} ${addr.zip}</p>
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button class="edit-address-btn text-blue-500 hover:text-blue-700" data-payload='${JSON.stringify(addr).replace(/'/g, "&#39;")}'>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                 </button>
                 <button class="delete-address-btn text-red-500 hover:text-red-700" data-id="${addr.id || addr.street}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                 </button>
              </div>
            </div>
          `).join('');
        } else if (data.address) { // fallback for legacy single address
          addressHtml = `
            <div class="mb-4 bg-gray-50 border border-gray-100 rounded p-3 relative group">
              <p class="font-medium text-gray-900">${data.name || displayName}</p>
              <p>${data.address.street}</p>
              <p>${data.address.city}, ${data.address.state} ${data.address.zip}</p>
            </div>
           `;
        }

        // Render Payments Array
        if (data.paymentMethods && data.paymentMethods.length > 0) {
          paymentHtml = data.paymentMethods.map(pm => `
             <div class="mb-4 bg-gray-50 border border-gray-100 rounded p-3 relative group">
                <p class="font-medium text-gray-900 flex items-center gap-2">
                   <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                   •••• •••• •••• ${pm.last4}
                </p>
                <p class="mt-1 text-xs">Expires: ${pm.exp}</p>
                <p class="mt-1 text-xs">Cardholder: ${pm.name}</p>
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                   <button class="edit-payment-btn text-blue-500 hover:text-blue-700" data-payload='${JSON.stringify(pm).replace(/'/g, "&#39;")}'>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                   </button>
                   <button class="delete-payment-btn text-red-500 hover:text-red-700" data-id="${pm.id || pm.last4}">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                </div>
             </div>
          `).join('');
        } else if (data.payment) { // fallback for legacy single payment
          paymentHtml = `
             <div class="mb-4 bg-gray-50 border border-gray-100 rounded p-3 relative group">
                <p class="font-medium text-gray-900 flex items-center gap-2">
                   <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                   •••• •••• •••• ${data.payment.last4}
                </p>
                <p class="mt-1 text-xs">Expires: ${data.payment.exp}</p>
                <p class="mt-1 text-xs">Cardholder: ${data.payment.name}</p>
             </div>
           `;
        }
      }

      // Real-time tracking is pushed to onAccountMount
      ordersHtml = `<div id="orders-container" class="min-h-[100px] flex items-center justify-center text-gray-500">Loading orders...</div>`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return `
    ${renderNavbar()}
    <main class="flex-grow bg-gray-50/50 py-10 relative">
      <div class="max-w-7xl mx-auto px-6">
        
        <div class="flex flex-col md:flex-row gap-12">
          <!-- Sidebar -->
          <aside class="w-full md:w-64 flex-shrink-0">
            <!-- User Profile Header -->
            <div class="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
               <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg">
                 ${displayName.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h3 class="font-bold text-gray-900 truncate w-32">${displayName}</h3>
                  <p class="text-xs text-gray-500 truncate w-32">${user.email}</p>
               </div>
            </div>

            <nav class="space-y-2">
               <a href="#" class="flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012-2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
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
               <hr class="my-4 border-gray-100">
               <button id="logout-btn" class="w-full flex items-center gap-3 px-4 py-3 text-[#ff4d4f] hover:bg-red-50 rounded-md font-medium text-sm transition-colors">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                 Sign out
               </button>
            </nav>
          </aside>

          <!-- Main Content -->
          <div class="flex-grow">
             <div class="flex justify-between items-start mb-8">
               <div>
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
                  <p class="text-gray-500 user-select-none">Welcome back, ${displayName.split(' ')[0]}</p>
               </div>
               <a href="#" class="text-sm font-medium text-[#0051FF] hover:underline">Need help?</a>
             </div>

             <!-- Recent Orders -->
             <section class="mb-10">
               <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
               <div id="orders-container">${ordersHtml}</div>
             </section>

             <!-- Sub Sections (Cards) -->
             <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <!-- Address Card -->
               <div class="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-4 tracking-tight">Saved Addresses</h3>
                    <div class="text-sm text-gray-500 mb-8 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                       ${addressHtml}
                    </div>
                  </div>
                  <button id="open-address-modal" class="text-sm font-medium text-[#0051FF] hover:underline mt-auto text-left flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add New Address
                  </button>
               </div>

               <!-- Payment Card -->
               <div class="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-4 tracking-tight">Payment Methods</h3>
                    <div class="text-sm text-gray-500 mb-8 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                       ${paymentHtml}
                    </div>
                  </div>
                  <button id="open-payment-modal" class="text-sm font-medium text-[#0051FF] hover:underline mt-auto text-left flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Payment Method
                  </button>
               </div>
               
               <!-- Profile Card -->
                <div class="bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Personal Profile</h3>
                    <div class="text-sm text-gray-600 space-y-1 mb-8">
                       <p class="font-medium text-gray-900">${displayName}</p>
                       <p>${user.email}</p>
                       <p>${user.phone || 'No phone added'}</p>
                       <p class="mt-2 text-gray-400 flex items-center gap-2">Password: <span class="tracking-[0.2em] text-gray-300">••••••••</span></p>
                    </div>
                  </div>
                  <button id="open-profile-modal" class="text-sm font-medium text-[#0051FF] hover:underline mt-auto text-left">Edit Profile</button>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <!-- Modals (Hidden by Default) -->
      
      <!-- Edit Profile Modal -->
      <div id="profile-modal" class="fixed inset-0 bg-gray-900/50 hidden z-[100] flex items-center justify-center opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 transform scale-95 transition-transform duration-300">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button class="close-modal text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form id="profile-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value="${displayName}" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" value="${user.phone || ''}" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <button type="submit" class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition mt-6">Save Changes</button>
          </form>
        </div>
      </div>

      <!-- Address Modal -->
      <div id="address-modal" class="fixed inset-0 bg-gray-900/50 hidden z-[100] flex items-center justify-center opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 transform scale-95 transition-transform duration-300">
          <div class="flex justify-between items-center mb-6">
            <h2 id="address-modal-title" class="text-xl font-bold text-gray-900">Manage Address</h2>
            <button class="close-modal text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form id="address-form" class="space-y-4">
            <input type="hidden" name="editId" id="address-edit-id" value="">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" name="street" value="" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" name="city" value="" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State / Prov</label>
                <input type="text" name="state" value="" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
              <input type="text" name="zip" value="" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <button type="submit" class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition mt-6 text-center shadow-sm">Save Address</button>
          </form>
        </div>
      </div>

      <!-- Payment Modal -->
      <div id="payment-modal" class="fixed inset-0 bg-gray-900/50 hidden z-[100] flex items-center justify-center opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 transform scale-95 transition-transform duration-300">
          <div class="flex justify-between items-center mb-6">
            <h2 id="payment-modal-title" class="text-xl font-bold text-gray-900">Payment Details</h2>
            <button class="close-modal text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <form id="payment-form" class="space-y-4">
            <input type="hidden" name="editId" id="payment-edit-id" value="">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input type="text" name="name" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Card Number (Last 4 digits for demo)</label>
              <input type="text" name="last4" maxlength="4" placeholder="1234" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                <input type="text" name="exp" placeholder="12/26" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input type="text" name="cvc" maxlength="3" placeholder="123" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
              </div>
            </div>
            <button type="submit" class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition mt-6 text-center shadow-sm">Save Payment Method</button>
            <p class="text-xs text-red-500 mt-2 text-center">Note: This is a demo. Do not use real credit card numbers.</p>
          </form>
        </div>
      </div>

    </main>
    ${renderFooter()}
  `;
}

export function onAccountMount() {
  const state = store.getState();
  if (!state.user.isLoggedIn) return; // Already redirecting

  // Modals Logic
  const profileModal = document.getElementById('profile-modal');
  const addressModal = document.getElementById('address-modal');
  const paymentModal = document.getElementById('payment-modal');

  const openProfileBtn = document.getElementById('open-profile-modal');
  const openAddressBtn = document.getElementById('open-address-modal');
  const openPaymentBtn = document.getElementById('open-payment-modal');
  const closeBtns = document.querySelectorAll('.close-modal');

  const openModal = (modal) => {
    modal.classList.remove('hidden');
    // small timeout to allow display:block to apply before animating opacity/transform
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.children[0].classList.remove('scale-95');
    }, 10);
  };

  const closeModal = (modal) => {
    modal.classList.add('opacity-0');
    modal.children[0].classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  };

  if (openProfileBtn) openProfileBtn.addEventListener('click', () => openModal(profileModal));
  if (openAddressBtn) openAddressBtn.addEventListener('click', () => {
    document.getElementById('address-form').reset();
    document.getElementById('address-edit-id').value = '';
    document.getElementById('address-modal-title').textContent = 'Add New Address';
    openModal(addressModal);
  });
  if (openPaymentBtn) openPaymentBtn.addEventListener('click', () => {
    document.getElementById('payment-form').reset();
    document.getElementById('payment-edit-id').value = '';
    document.getElementById('payment-modal-title').textContent = 'Add Payment Method';
    openModal(paymentModal);
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.currentTarget.closest('.fixed.inset-0');
      if (modal) closeModal(modal);
    });
  });

  // Logout Logic
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      store.dispatch({ type: 'LOGOUT' });
    });
  }

  const bindOrderToggleLogic = () => {
    const orderRows = document.querySelectorAll('tr[data-order-row]');
    orderRows.forEach(row => {
      row.addEventListener('click', (e) => {
        const orderId = row.getAttribute('data-order-row');
        const detailsRow = document.getElementById(`order-details-${orderId}`);
        const icon = row.querySelector('svg');

        if (detailsRow) {
          detailsRow.classList.toggle('hidden');
          if (detailsRow.classList.contains('hidden')) {
            icon.classList.remove('rotate-180');
          } else {
            icon.classList.add('rotate-180');
          }
        }
      });
    });
  };

  // Real-time Orders Snapshot Listener
  const uid = auth.currentUser?.uid || state.user?.uid;
  if (uid) {
    const q = query(collection(db, "orders"), where("customerId", "==", uid));
    onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const container = document.getElementById('orders-container');
      if (container) {
        container.innerHTML = generateOrdersHtml(orders);
        bindOrderToggleLogic();
      }
    });
  }

  // Edit Profile Sync
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Saving...';

      const formData = new FormData(profileForm);
      const name = formData.get('name');
      const phone = formData.get('phone');

      try {
        const uid = auth.currentUser ? auth.currentUser.uid : state.user.uid;
        await updateDoc(doc(db, "users", uid), { name, phone });
        store.dispatch({ type: 'LOGIN', payload: { ...state.user, name, phone } });

        btn.textContent = 'Saved!';
        btn.classList.replace('bg-blue-600', 'bg-green-500');
        setTimeout(() => window.location.reload(), 1000);
      } catch (e) {
        console.error(e);
        btn.textContent = 'Error';
        btn.classList.replace('bg-blue-600', 'bg-red-500');
        setTimeout(() => { btn.textContent = originalText; btn.classList.replace('bg-red-500', 'bg-blue-600'); }, 2000);
      }
    });
  }

  // Edit Address Sync
  const addressForm = document.getElementById('address-form');
  if (addressForm) {
    addressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Saving...';

      const formData = new FormData(addressForm);
      const editId = formData.get('editId');
      formData.delete('editId'); // don't save this in the object
      const address = Object.fromEntries(formData.entries());

      try {
        const uid = auth.currentUser ? auth.currentUser.uid : state.user.uid;
        const userDocRef = doc(db, "users", uid);

        if (editId) {
          // Edit Mode: Read array, map replacement, write array
          const snap = await getDoc(userDocRef);
          let addresses = snap.data().addresses || [];
          addresses = addresses.map(a => a.id === editId ? { ...address, id: editId } : a);
          await updateDoc(userDocRef, { addresses });
        } else {
          // New Mode
          address.id = Date.now().toString();
          await updateDoc(userDocRef, { addresses: arrayUnion(address) });
        }

        btn.textContent = 'Saved!';
        btn.classList.replace('bg-blue-600', 'bg-green-500');
        setTimeout(() => window.location.reload(), 1000);
      } catch (e) {
        console.error(e);
        btn.textContent = 'Error';
        btn.classList.replace('bg-blue-600', 'bg-red-500');
        setTimeout(() => { btn.textContent = originalText; btn.classList.replace('bg-red-500', 'bg-blue-600'); }, 2000);
      }
    });
  }

  // Edit Payment Sync
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Saving...';

      const formData = new FormData(paymentForm);
      const editId = formData.get('editId');
      formData.delete('editId');
      const payment = Object.fromEntries(formData.entries());

      try {
        const uid = auth.currentUser ? auth.currentUser.uid : state.user.uid;
        const userDocRef = doc(db, "users", uid);

        if (editId) {
          const snap = await getDoc(userDocRef);
          let payments = snap.data().paymentMethods || [];
          payments = payments.map(p => p.id === editId ? { ...payment, id: editId } : p);
          await updateDoc(userDocRef, { paymentMethods: payments });
        } else {
          payment.id = Date.now().toString();
          await updateDoc(userDocRef, { paymentMethods: arrayUnion(payment) });
        }

        btn.textContent = 'Saved!';
        btn.classList.replace('bg-blue-600', 'bg-green-500');
        setTimeout(() => window.location.reload(), 1000);
      } catch (e) {
        console.error(e);
        btn.textContent = 'Error';
        btn.classList.replace('bg-blue-600', 'bg-red-500');
        setTimeout(() => { btn.textContent = originalText; btn.classList.replace('bg-red-500', 'bg-blue-600'); }, 2000);
      }
    });
  }

  // Handle Editing & Deletions cleanly via event delegation
  document.body.addEventListener('click', async (e) => {
    const deleteAddrBtn = e.target.closest('.delete-address-btn');
    const deletePayBtn = e.target.closest('.delete-payment-btn');
    const editAddrBtn = e.target.closest('.edit-address-btn');
    const editPayBtn = e.target.closest('.edit-payment-btn');

    const uid = auth.currentUser ? auth.currentUser.uid : state.user.uid;

    // ---- EDIT ADDRESS ----
    if (editAddrBtn) {
      try {
        const payload = JSON.parse(editAddrBtn.getAttribute('data-payload'));
        document.getElementById('address-edit-id').value = payload.id || '';
        document.querySelector('#address-form input[name="street"]').value = payload.street || '';
        document.querySelector('#address-form input[name="city"]').value = payload.city || '';
        document.querySelector('#address-form input[name="state"]').value = payload.state || '';
        document.querySelector('#address-form input[name="zip"]').value = payload.zip || '';
        document.getElementById('address-modal-title').textContent = 'Edit Address';
        openModal(addressModal);
      } catch (err) { console.error('Failed to parse address data', err); }
    }

    // ---- EDIT PAYMENT ----
    if (editPayBtn) {
      try {
        const payload = JSON.parse(editPayBtn.getAttribute('data-payload'));
        document.getElementById('payment-edit-id').value = payload.id || '';
        document.querySelector('#payment-form input[name="name"]').value = payload.name || '';
        document.querySelector('#payment-form input[name="last4"]').value = payload.last4 || '';
        document.querySelector('#payment-form input[name="exp"]').value = payload.exp || '';
        document.querySelector('#payment-form input[name="cvc"]').value = payload.cvc || '';
        document.getElementById('payment-modal-title').textContent = 'Edit Payment Method';
        openModal(paymentModal);
      } catch (err) { console.error('Failed to parse payment data', err); }
    }

    // ---- DELETE ADDRESS ----
    if (deleteAddrBtn && uid) {
      const id = deleteAddrBtn.getAttribute('data-id');
      await deleteWithConfirmation('Are you sure you want to remove this address?', id, uid, 'addresses');
    }

    // ---- DELETE PAYMENT ----
    if (deletePayBtn && uid) {
      const id = deletePayBtn.getAttribute('data-id');
      await deleteWithConfirmation('Are you sure you want to remove this payment method?', id, uid, 'paymentMethods');
    }
  });

  // Reusable styling delete confirmation function
  async function deleteWithConfirmation(message, targetId, uid, collectionArray) {
    // Very simple custom styled confirmation overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[200] bg-gray-900/50 flex items-center justify-center opacity-0 transition-opacity';
    overlay.innerHTML = `
         <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform scale-95 transition-transform text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Item</h3>
            <p class="text-sm text-gray-500 mb-6">${message}</p>
            <div class="flex gap-3 justify-center">
               <button class="cancel-btn px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors">Cancel</button>
               <button class="confirm-btn px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Yes, Delete</button>
            </div>
         </div>
      `;
    document.body.appendChild(overlay);

    // Animate In
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.querySelector('div').classList.remove('scale-95');
    });

    return new Promise((resolve) => {
      overlay.querySelector('.cancel-btn').addEventListener('click', () => {
        removeOverlay();
        resolve(false);
      });
      overlay.querySelector('.confirm-btn').addEventListener('click', async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          const arrayItems = userDoc.data()[collectionArray] || [];
          const targetItem = arrayItems.find(a => (a.id || a.street || a.last4) === targetId);

          if (targetItem) {
            await updateDoc(doc(db, "users", uid), {
              [collectionArray]: arrayRemove(targetItem)
            });
            window.location.reload();
          }
        } catch (err) {
          console.error("Failed to delete", err);
        }
        removeOverlay();
        resolve(true);
      });

      function removeOverlay() {
        overlay.classList.add('opacity-0');
        overlay.querySelector('div').classList.add('scale-95');
        setTimeout(() => overlay.remove(), 300);
      }
    });
  }
}

// Extracted Real-time Order HTML Generator
function generateOrdersHtml(orders) {
  if (orders.length === 0) {
    return `
            <div class="bg-white border text-sm text-gray-600 border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center py-12 px-4 text-center">
               <svg class="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
               <p class="text-gray-900 font-semibold mb-1">No Orders Yet</p>
               <p class="text-gray-500 max-w-sm">When you place orders, they will appear here so you can track their status.</p>
               <a href="/store" data-link class="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Start Shopping</a>
             </div>
        `;
  }

  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return `
      <div class="bg-white border text-sm text-gray-600 border-gray-100 rounded-xl shadow-sm overflow-hidden custom-scrollbar max-h-96 overflow-y-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100 sticky top-0">
            <tr>
              <th class="py-3 px-6 font-medium text-gray-500">Order ID</th>
              <th class="py-3 px-6 font-medium text-gray-500">Date</th>
              <th class="py-3 px-6 font-medium text-gray-500 text-center">Status</th>
              <th class="py-3 px-6 font-medium text-gray-500 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y text-gray-900 font-medium divide-gray-100">
            ${orders.map(order => `
              <tr class="group cursor-pointer hover:bg-gray-50 transition-colors" data-order-row="${order.id}">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <span class="text-[#0051FF] font-medium">#${String(order.id).slice(-6).toUpperCase()}</span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </td>
                <td class="py-4 px-6 text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</td>
                <td class="py-4 px-6 text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-[#0051FF]/10 text-[#0051FF]'}">${order.status || 'Pending'}</span>
                </td>
                <td class="py-4 px-6 text-right font-bold">$${(order.totalAmount || 0).toFixed(2)}</td>
              </tr>
              <tr id="order-details-${order.id}" class="hidden bg-gray-50/50">
                <td colspan="4" class="px-6 py-4">
                  <div class="border border-gray-100 rounded-lg p-4 bg-white">
                    <h4 class="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                    <ul class="space-y-3">
                      ${order.items ? order.items.map(item => `
                        <li class="flex items-center gap-4 text-sm">
                          <div class="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                          </div>
                          <div class="flex-grow">
                            <p class="font-medium text-gray-900">${item.name}</p>
                            <p class="text-gray-500 text-xs">Qty: ${item.quantity}</p>
                          </div>
                          <div class="font-medium text-gray-900">$${(item.price * item.quantity).toFixed(2)}</div>
                        </li>
                      `).join('') : '<li class="text-sm text-gray-500">No items found for this order.</li>'}
                    </ul>
                    <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
                      <span class="text-gray-500">Shipping Address: ${order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 'N/A'}</span>
                      <a href="#" class="text-blue-600 hover:text-blue-700 font-medium tracking-wide text-xs uppercase">Get Support</a>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
}
