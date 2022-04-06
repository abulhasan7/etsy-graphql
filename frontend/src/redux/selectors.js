export const getToken = (state) => ({ token: state.tokenSlice.token });

export const getTokenAndUserId = (state) => ({
  token: state.tokenSlice.token,
  user_id: state.profileSlice.profile.user_id,
});

export const getTokenAndCart = (state) => ({
  cart: state.cartSlice.cart,
  token: state.tokenSlice.token,
});

export const getTokenAndCurrency = (state) => ({
  token: state.tokenSlice.token,
  currency: state.currencySlice.currency,
});

export const getTokenCurrencyAndCart = (state) => ({
  cart: state.cartSlice.cart,
  token: state.tokenSlice.token,
  currency: state.currencySlice.currency,
});

export const getCurrencyAndCart = (state) => ({
  currency: state.currencySlice.currency,
  cart: state.cartSlice.cart,
});

export const getCurrency = (state) => ({ currency: state.currencySlice.currency });

export const getFullName = (state) => state.profile.fullname;

export const getTokenFullNameAndCurrency = (state) => ({
  token: state.tokenSlice.token,
  currency: state.currencySlice.currency,
  fullname: state.profileSlice.profile.fullname,
});

export const getTokenAndFullName = (state) => ({
  token: state.tokenSlice.token,
  fullname: state.profileSlice.profile.fullname,
});

export const getTokenAndProfile = (state) => ({
  token: state.tokenSlice.token,
  profile: state.profileSlice.profile,
});

export const getTokenCurrencyProfileAndCart = (state) => ({
  cart: state.cartSlice.cart,
  token: state.tokenSlice.token,
  currency: state.currencySlice.currency,
  profile: state.profileSlice.profile,
});
