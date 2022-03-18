export const getToken = state => {return {token:state.tokenSlice.token}}
export const getTokenAndCart = state => { return {cart:state.cartSlice.cart,token:state.tokenSlice.token}}
