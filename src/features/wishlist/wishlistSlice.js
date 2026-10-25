
import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
    try {
        const saved = localStorage.getItem('aisleWishlist');
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Could not load wishlist:', error);
        return [];
    }
};

const initialState = {
    wishlist: loadWishlist()
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,

    reducers: {
        toggleWishlist: (state, action) => {
            const product = action.payload;

            if (!product || !product.id) return;

            const exists = state.wishlist.some(
                item => item.id === product.id
            );

            if (exists) {
                state.wishlist = state.wishlist.filter(
                    item => item.id !== product.id
                );
            } else {
                state.wishlist.push({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.image,
                    badge: product.badge || '',
                    room: product.room || '',
                    style: product.style || '',
                    brand: product.brand || 'AISLE',
                    stock: product.stock ?? 1
                });
            }
        },

        removeFromWishlist: (state, action) => {
            const id = action.payload;

            state.wishlist = state.wishlist.filter(
                item => item.id !== id
            );
        }
    }
});

export const {
    toggleWishlist,
    removeFromWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
