export const getToken = state => {return {token:state.tokenSlice.token}}
export const getTokenAndCart = state => { return {cart:state.cartSlice.cart,token:state.tokenSlice.token}}
export const getTokenAndCurrency = state => {return {token:state.tokenSlice.token,currency:state.currencySlice.currency}}
export const getTokenCurrencyAndCart = state => { return {cart:state.cartSlice.cart,token:state.tokenSlice.token,currency:state.currencySlice.currency}}
export const getCurrency = state => {return {currency:state.currencySlice.currency}}
