import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  subtotal: 0,
  delivery: 0,
  gst: 0,
  total: 0,
  deliveryDate: ''
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {},
    removeFromCart: (state, action) => {},
    changeQuantity: (state, action) => {},
    clearCart: (state) => {},
  },
});

export const {
  addToCart,
  removeFromCart,
  changeQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
