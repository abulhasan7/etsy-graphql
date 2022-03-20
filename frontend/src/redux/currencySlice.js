/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    // this is the actual key that will be stored in the redux store
    currency: localStorage.getItem('currency') || '$',
  },
  reducers: {
    changeCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { changeCurrency } = currencySlice.actions;

export default currencySlice.reducer;
