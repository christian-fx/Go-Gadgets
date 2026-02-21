// src/store.js
// A simple reactive store using listeners

const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem('goGadgetsCart');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
};

const state = {
    cart: loadCartFromStorage(),
    user: {
        isLoggedIn: false,
        name: 'Priya Patel', // Mock data
        email: 'priya.p@example.com'
    },
    products: [
        { id: 1, name: 'Sonic Pro X Wireless', category: 'Audio', price: 299.00, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', description: 'Color: Matte Black, Warranty: 1 Year Standard' },
        { id: 2, name: 'Vision VR Headset', category: 'Gaming', price: 499.00, image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'SkyStream 4 Drone', category: 'Drones', price: 899.00, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Echo Bass Speaker', category: 'Smart Home', price: 129.00, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 5, name: 'RGB Mech Keyboard', category: 'Gaming', price: 99.00, originalPrice: 149.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', badge: 'SALE' },
        { id: 6, name: 'Phone X Pro', category: 'Smartphones', price: 999.00, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 7, name: 'FitBand Active', category: 'Wearables', price: 79.00, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 8, name: 'AirBuds True Wireless', category: 'Audio', price: 159.00, image: 'https://images.unsplash.com/photo-1606220588913-b3eea41b6d0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 9, name: 'ActionCam 5K', category: 'Cameras', price: 349.00, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', description: 'Bundle: Adventure Kit, SD Card: 64GB Included' },
    ],
};

const listeners = [];

export const store = {
    getState() {
        return state;
    },

    subscribe(listener) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    },

    dispatch(action) {
        switch (action.type) {
            case 'ADD_TO_CART':
                const existingItem = state.cart.find(i => i.id === action.payload.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.cart.push({ ...action.payload, quantity: 1 });
                }
                break;
            case 'REMOVE_FROM_CART':
                state.cart = state.cart.filter(i => i.id !== action.payload.id);
                break;
            case 'UPDATE_QUANTITY':
                const item = state.cart.find(i => i.id === action.payload.id);
                if (item) {
                    item.quantity = action.payload.quantity;
                    if (item.quantity <= 0) {
                        state.cart = state.cart.filter(i => i.id !== action.payload.id);
                    }
                }
                break;
            case 'CLEAR_CART':
                state.cart = [];
                break;
            case 'LOGIN':
                state.user.isLoggedIn = true;
                break;
            case 'LOGOUT':
                state.user.isLoggedIn = false;
                break;
        }

        // Persist cart
        try {
            localStorage.setItem('goGadgetsCart', JSON.stringify(state.cart));
        } catch (e) {
            console.error("Could not save cart to localStorage", e);
        }

        listeners.forEach(listener => listener(state));
    }
};
