import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {},
    removeFromWishlist: (state, action) => {},
  },
});

export const {
  toggleWishlist,
  removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;