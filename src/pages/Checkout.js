// src/pages/Checkout.js
import { store } from '../store.js';
import { db, auth } from '../api/firebase-config.js';
import { collection, addDoc, doc, updateDoc, increment, runTransaction, getDoc } from "firebase/firestore";

export async function renderCheckout() {
  const state = store.getState();
  const cart = state.cart;
  const user = state.user;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.length === 0) {
    setTimeout(() => window.router.navigate('/cart'), 0);
    return `<div class="min-h-screen flex items-center justify-center bg-gray-50"><p class="text-gray-500">Redirecting to cart...</p></div>`;
  }

  // Prefill if logged in
  const prefillEmail = user.isLoggedIn ? user.email : '';
  const prefillName = user.isLoggedIn ? user.name : '';
  let savedAddresses = [];
  let savedPayments = [];

  if (user.isLoggedIn && user.uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        savedAddresses = userDoc.data().addresses || [];
        savedPayments = userDoc.data().paymentMethods || [];
      }
    } catch (e) { console.error(e) }
  }

  const addressOptions = savedAddresses.map(a => `<option value="${a.id}">${a.street}, ${a.city}</option>`).join('');
  const paymentOptions = savedPayments.map(p => `<option value="${p.id}">•••• ${p.last4} (${p.name})</option>`).join('');

  return `
    <div class="min-h-screen bg-white flex flex-col md:flex-row">
      <!-- Left Column: Form -->
      <div class="w-full md:w-7/12 pt-10 px-6 md:px-12 lg:px-24">
        <!-- Minimal Header -->
        <header class="flex items-center justify-between border-b pb-6 mb-8">
          <a href="/" data-link class="text-xl font-bold text-gray-900 tracking-tight">GO GADGETS</a>
          <div class="text-xs text-gray-500 font-medium tracking-wide border px-2 py-1 rounded bg-gray-50 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Secure Checkout
          </div>
        </header>

        <!-- Breadcrumbs -->
        <nav class="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <a href="/cart" data-link class="text-[#0051FF] hover:underline">Cart</a>
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="font-medium text-gray-900">Information</span>
        </nav>

        <form id="checkout-form">
          <!-- Contact Info -->
          <section class="mb-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
              ${!user.isLoggedIn ? `<p class="text-sm text-gray-600">Already have an account? <a href="/auth" class="text-[#0051FF] hover:underline font-medium">Log in</a></p>` : ''}
            </div>
             <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" id="email" name="email" required value="${prefillEmail}" placeholder="you@example.com" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
             </div>
             <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="marketing" checked class="w-4 h-4 text-[#0051FF] rounded border-gray-300 focus:ring-[#0051FF]">
              <span class="text-sm text-gray-600">Email me with news and offers</span>
             </label>
          </section>

          <!-- Shipping Address -->
          <section class="mb-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>
            
            ${savedAddresses.length > 0 ? `
               <div class="mb-6">
                 <label class="block text-sm font-medium text-gray-700 mb-1">Select a Saved Address</label>
                 <select id="saved-address-select" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] bg-white">
                    <option value="new">-- Enter a new address --</option>
                    ${addressOptions}
                 </select>
               </div>
            ` : ''}

            <div id="new-address-form" class="space-y-4 ${savedAddresses.length > 0 ? 'hidden' : ''}">
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country/Region</label>
                <select name="country" id="country" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF] text-gray-900 bg-white">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input type="text" id="firstName" name="firstName" value="${prefillName.split(' ')[0] || ''}" placeholder="First" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input type="text" id="lastName" name="lastName" value="${prefillName.split(' ')[1] || ''}" placeholder="Last" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                </div>
              </div>
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" id="address" name="address" placeholder="Street address or P.O. Box" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
              </div>
              <div>
                <label for="apartment" class="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                <input type="text" id="apartment" name="apartment" placeholder="Apt, suite, unit" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" id="city" name="city" placeholder="City" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                </div>
                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" id="state" name="state" placeholder="State" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                </div>
                <div>
                  <label for="zip" class="block text-sm font-medium text-gray-700 mb-1">ZIP code</label>
                  <input type="text" id="zip" name="zip" placeholder="ZIP code" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
                </div>
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone <span class="text-gray-400 font-normal opacity-0 sm:opacity-100">(In case of delivery issues)</span></label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 555-5555" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] focus:ring-1 focus:ring-[#0051FF]">
              </div>
            </div>
            
            <div id="checkout-alert" class="hidden mt-6 p-4 rounded-md text-sm font-medium"></div>

            <!-- Fake Payment Methods Selector -->
            <div class="mt-8 border-t border-gray-100 pt-8">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              ${savedPayments.length > 0 ? `
                 <div class="mb-4">
                   <select id="saved-payment-select" class="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#0051FF] bg-white">
                      <option value="default">Demo Credit Card ending in 4242</option>
                      ${paymentOptions}
                   </select>
                 </div>
              ` : `
                 <div class="p-4 border border-blue-100 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-start gap-3">
                   <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   <p>A secure test payment profile will be used for this order.</p>
                 </div>
              `}
            </div>

            <!-- Actions -->
            <div class="flex justify-between items-center py-6 mt-6 border-t border-gray-100">
              <a href="/cart" data-link class="text-[#0051FF] hover:underline text-sm font-medium flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                Return to cart
              </a>
              <button type="submit" id="checkout-btn" class="bg-[#0051FF] hover:bg-[#0040CC] px-8 py-3.5 rounded-lg text-white font-semibold transition-colors shadow-sm flex items-center gap-2">
                Place Order
              </button>
            </div>
          </section>
        </form>
      </div>

      <!-- Right Column: Order Summary Side Panel -->
      <div class="w-full md:w-5/12 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
         <div class="sticky top-0 pt-10 px-6 md:px-10 pb-10">
            <!-- Items -->
            <div class="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              ${cart.map(item => `
                <div class="flex items-center justify-between gap-4">
                  <div class="relative w-16 h-16 rounded-md border border-gray-200 bg-white shadow-sm flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-md">
                    <span class="absolute -top-2 -right-2 bg-gray-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">${item.quantity}</span>
                  </div>
                  <div class="flex-grow">
                    <h4 class="text-sm font-semibold text-gray-900 line-clamp-1">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.category}</p>
                  </div>
                  <div class="font-medium text-sm text-gray-900">
                    $${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Totals -->
            <div class="border-t border-gray-200 py-6 space-y-3">
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500">Subtotal</span>
                 <span class="text-gray-900 font-medium">$${subtotal.toFixed(2)}</span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500">Shipping</span>
                 <span class="text-gray-900 font-medium tracking-wide">FREE</span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500">Estimated Taxes</span>
                 <span class="text-gray-900 font-medium">$${tax.toFixed(2)}</span>
               </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <div class="flex justify-between items-center">
                 <span class="text-lg text-gray-900 font-bold">Total</span>
                 <div class="flex items-center gap-2">
                   <span class="text-xs text-gray-500 font-medium tracking-wide">USD</span>
                   <span class="text-2xl font-bold text-gray-900">$${total.toFixed(2)}</span>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  `;
}

export function onCheckoutMount() {
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutBtn = document.getElementById('checkout-btn');
  const alertBox = document.getElementById('checkout-alert');
  const savedAddressSelect = document.getElementById('saved-address-select');
  const newAddressForm = document.getElementById('new-address-form');

  if (savedAddressSelect && newAddressForm) {
    savedAddressSelect.addEventListener('change', (e) => {
      if (e.target.value === 'new') {
        newAddressForm.classList.remove('hidden');
        // Make fields required when new address form is active
        newAddressForm.querySelectorAll('input, select').forEach(input => {
          if (input.name !== 'apartment' && input.name !== 'phone') {
            input.required = true;
          }
        });
      } else {
        newAddressForm.classList.add('hidden');
        // Remove required when hidden
        newAddressForm.querySelectorAll('input, select').forEach(input => input.required = false);
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(checkoutForm);
      const state = store.getState();

      alertBox.classList.add('hidden');

      if (!state.user.isLoggedIn) {
        alertBox.textContent = 'Oops! Please log in or create an account before you can check out safely.';
        alertBox.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-green-50', 'text-green-700');
        alertBox.classList.add('block', 'bg-red-50', 'text-red-700');
        setTimeout(() => window.router.navigate('/auth'), 2000);
        return;
      }

      // Check for verification (Google auth usually sets emailVerified to true)
      if (state.user.emailVerified === false) {
        alertBox.textContent = 'Hold on! You must verify your email address to complete a purchase. We are redirecting you...';
        alertBox.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-green-50', 'text-green-700');
        alertBox.classList.add('block', 'bg-yellow-50', 'text-yellow-700');
        setTimeout(() => window.router.navigate('/auth'), 2500);
        return;
      }

      const uid = auth.currentUser ? auth.currentUser.uid : state.user.uid;

      const originalText = checkoutBtn.innerHTML;
      checkoutBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      `;
      checkoutBtn.disabled = true;

      try {
        const cartItems = state.cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));

        const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08;

        // 1. Transaction to Verify & Deduct Stock, Create Order, and Update Stats
        await runTransaction(db, async (transaction) => {
          // --- ALL READS FIRST ---

          // Read all products
          const productSnaps = [];
          for (const item of cartItems) {
            const productRef = doc(db, "products", item.id);
            const snap = await transaction.get(productRef);
            productSnaps.push({ snap, item, ref: productRef });
          }

          // Read User Doc (for shipping address if needed, and for updating stats)
          const userRef = doc(db, "users", uid);
          const userSnap = await transaction.get(userRef);

          // --- VALIDATION & LOGIC ---

          // Validate stock first before any writes
          for (const { snap, item } of productSnaps) {
            if (!snap.exists()) throw new Error(`Product ${item.name} removed!`);
            const currentStock = snap.data().stock;
            if (currentStock < item.quantity) {
              throw new Error(`Not enough stock for ${item.name}! Only ${currentStock} left.`);
            }
          }

          // Build Shipping Address Object
          let finalShippingAddress;
          if (savedAddressSelect && savedAddressSelect.value !== 'new') {
            const addresses = userSnap.exists() ? (userSnap.data().addresses || []) : [];
            finalShippingAddress = addresses.find(a => a.id === savedAddressSelect.value) || {};
          } else {
            // Construct from form
            finalShippingAddress = {
              street: formData.get('address'),
              city: formData.get('city'),
              state: formData.get('state'),
              zip: formData.get('zip'),
              country: formData.get('country'),
              apartment: formData.get('apartment') || '',
              phone: formData.get('phone') || ''
            };
          }

          // Build Customer Name
          const customerName = state.user.name || (formData.get('firstName') + ' ' + formData.get('lastName'));

          // --- ALL WRITES NOW ---

          // Deduct stock
          for (const { snap, item, ref } of productSnaps) {
            const currentStock = snap.data().stock;
            transaction.update(ref, { stock: currentStock - item.quantity });
          }

          // Create Order Record
          const newOrderRef = doc(collection(db, "orders"));
          transaction.set(newOrderRef, {
            customerId: uid,
            customerName: customerName,
            customerEmail: state.user.email,
            items: cartItems,
            totalAmount: totalAmount,
            shippingAddress: finalShippingAddress,
            status: 'Processing',
            createdAt: new Date().toISOString()
          });

          // Update User Stats
          if (userSnap.exists()) {
            const currentSpent = userSnap.data().totalSpent || 0;
            const currentOrders = userSnap.data().orders || 0;

            transaction.update(userRef, {
              totalSpent: currentSpent + totalAmount,
              orders: currentOrders + 1
            });
          }
        });

        alertBox.textContent = 'Order placed successfully! Redirecting...';
        alertBox.classList.remove('hidden', 'bg-red-50', 'text-red-700');
        alertBox.classList.add('block', 'bg-green-50', 'text-green-700');

        setTimeout(() => {
          store.dispatch({ type: 'CLEAR_CART' });
          window.router.navigate('/account');
        }, 1500);

      } catch (error) {
        console.error("Checkout Error: ", error);
        alertBox.textContent = error.message || 'Transaction failed. Please try again.';
        alertBox.classList.remove('hidden', 'bg-green-50', 'text-green-700');
        alertBox.classList.add('block', 'bg-red-50', 'text-red-700');
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
      }
    });
  }
}
