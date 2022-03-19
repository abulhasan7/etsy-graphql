export const getToken = (state) => {
  return { token: state.tokenSlice.token };
};

export const getTokenAndUserId = (state) => {
    return { token: state.tokenSlice.token,user_id:state.profileSlice.profile.user_id };
};

export const getTokenAndCart = (state) => {
  return { cart: state.cartSlice.cart, token: state.tokenSlice.token };
};

export const getTokenAndCurrency = (state) => {
  return {
    token: state.tokenSlice.token,
    currency: state.currencySlice.currency,
  };
};

export const getTokenCurrencyAndCart = (state) => {
  return {
    cart: state.cartSlice.cart,
    token: state.tokenSlice.token,
    currency: state.currencySlice.currency,
  };
};

export const getCurrency = (state) => {
  return { currency: state.currencySlice.currency };
};

export const getFullName = (state) => {
  return state.profile.fullname;
};

export const getTokenFullNameAndCurrency = (state) => {
  return {
    token: state.tokenSlice.token,
    currency: state.currencySlice.currency,
    fullname: state.profileSlice.profile.fullname,
  };
};

export const getTokenAndFullName = (state) => {
  return { token: state.tokenSlice.token, fullname: state.profileSlice.profile.fullname };
};

export const getTokenAndProfile = (state) => {
    return { token: state.tokenSlice.token, profile: state.profileSlice.profile };
  };
  
  export const getTokenCurrencyProfileAndCart = (state) => {
    return {
      cart: state.cartSlice.cart,
      token: state.tokenSlice.token,
      currency: state.currencySlice.currency,
      profile:state.profileSlice.profile
    };
  };