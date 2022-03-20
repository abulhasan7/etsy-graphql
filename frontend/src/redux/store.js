/* eslint-disable import/no-named-as-default */
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import tokenSlice from './tokenSlice';
import currencySlice from './currencySlice';
import profileSlice from './profileSlice';

export default configureStore({
  reducer: {
    tokenSlice, cartSlice, currencySlice, profileSlice,
  },
});
