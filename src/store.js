// src/store.js
// A simple reactive store using listeners
import { auth, db } from './api/firebase-config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
        name: null,
        email: null,
        phone: null
    },
    products: [],
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
                state.user = {
                    isLoggedIn: true,
                    ...action.payload
                };
                break;
            case 'LOGOUT':
                signOut(auth).catch(err => console.error(err));
                state.user = {
                    isLoggedIn: false,
                    name: null,
                    email: null,
                    phone: null,
                    uid: null
                };
                window.router.navigate('/');
                break;
            case 'LOGOUT_SILENT':
                state.user = {
                    isLoggedIn: false,
                    name: null,
                    email: null,
                    phone: null,
                    uid: null
                };
                break;
            case 'SET_PRODUCTS':
                state.products = action.payload;
                break;
        }

        // Persist cart
        try {
            localStorage.setItem('goGadgetsCart', JSON.stringify(state.cart));
        } catch (e) {
            console.error("Could not save cart to localStorage", e);
        }

        listeners.forEach(listener => listener(state));
    },

    initAuthListener(onInitCallback) {
        let initialized = false;
        const completeInit = () => {
            if (!initialized && onInitCallback) {
                initialized = true;
                onInitCallback();
            }
        };

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docSnap = await getDoc(doc(db, "users", user.uid));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        this.dispatch({
                            type: 'LOGIN',
                            payload: {
                                name: data.name,
                                email: user.email,
                                phone: data.phone,
                                uid: user.uid,
                                emailVerified: user.emailVerified
                            }
                        });
                    } else {
                        // Fallback if document doesn't exist
                        this.dispatch({
                            type: 'LOGIN',
                            payload: {
                                name: 'User',
                                email: user.email,
                                phone: null,
                                uid: user.uid,
                                emailVerified: user.emailVerified
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    completeInit();
                }
            } else {
                this.dispatch({ type: 'LOGOUT_SILENT' });
                completeInit();
            }
        });
    }
};
