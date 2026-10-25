
import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
});

// Save wishlist changes to localStorage
store.subscribe(() => {
    try {
        const wishlist = store.getState().wishlist.wishlist;

        localStorage.setItem(
            'aisleWishlist',
            JSON.stringify(wishlist)
        );
    } catch (error) {
        console.error('Could not save wishlist:', error);
    }
});
