import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name:'cart',
    initialState:{
        //this is the actual key that will be stored in the redux store
        cart:JSON.parse(localStorage.getItem('cart') || "{}"),
    },
    reducers:{
        addCart: (state,action) =>{
            state.cart = {
                ...state.cart,
                [(action.payload).item_id]:action.payload
            }
        },
        removeCart: (state,action) =>{
            state.cart = Object.keys(state.cart).filter(key=>key!=action.payload)
        }
    }
})

export const {addCart,removeCart} = cartSlice.actions

export default cartSlice.reducer