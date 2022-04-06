/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // this is the actual key that will be stored in the redux store
    cart: JSON.parse(localStorage.getItem('cart') || '{}'),
  },
  reducers: {
    addCart: (state, action) => {
      const tempCart = {
        ...state.cart,
        [(action.payload).item_id]: action.payload,
      };
      state.cart = tempCart;
      localStorage.setItem('cart', JSON.stringify(tempCart));
    },
    modifyCartQuantity: (state, action) => {
      const item = {
        ...(state.cart[action.payload.item_id]),
        quantity: action.payload.quantity,
      };
      const tempCart = {
        ...state.cart,
        [(action.payload).item_id]: item,
      };
      state.cart = tempCart;
      localStorage.setItem('cart', JSON.stringify(tempCart));
    },
    modifyGiftOption: (state, action) => {
      const item = {
        ...(state.cart[action.payload.item_id]),
        gift_description: action.payload.gift_description,
      };
      const tempCart = {
        ...state.cart,
        [(action.payload).item_id]: item,
      };
      state.cart = tempCart;
      localStorage.setItem('cart', JSON.stringify(tempCart));
    },
    removeCart: (state, action) => {
      const tempCart = { ...state.cart };
      // Object.keys(state.cart).filter(key=>key==action.payload);
      delete tempCart[action.payload];
      state.cart = tempCart;
      localStorage.setItem('cart', JSON.stringify(tempCart));
    },
    removeAllCart: (state) => {
      state.cart = {};
      localStorage.removeItem('cart');
    },

  },
});

export const {
  addCart, modifyCartQuantity, modifyGiftOption, removeCart, removeAllCart,
} = cartSlice.actions;

export default cartSlice.reducer;
