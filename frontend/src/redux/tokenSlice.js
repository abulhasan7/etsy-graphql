/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    // this is the actual key that will be stored in the redux store
    token: localStorage.getItem('token') || '',
  },
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    removeToken: (state) => {
      state.token = '';
      localStorage.clear();
    },
  },
});

export const { addToken, removeToken } = tokenSlice.actions;

export default tokenSlice.reducer;
