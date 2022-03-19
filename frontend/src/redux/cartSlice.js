import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name:'cart',
    initialState:{
        //this is the actual key that will be stored in the redux store
        cart:JSON.parse(localStorage.getItem('cart') || "{}"),
    },
    reducers:{
        addCart: (state,action) =>{
            console.log("action payload is ",action.payload);
            console.log("state is",state.cart);
            let tempCart = {
                ...state.cart,
                [(action.payload).item_id]:action.payload
            };
            console.log("tempcart is",tempCart);
            state.cart = tempCart;
            localStorage.setItem("cart",JSON.stringify(tempCart));
        },
        removeCart: (state,action) =>{
            let tempCart = Object.keys(state.cart).filter(key=>key!=action.payload);
            state.cart = tempCart
            localStorage.setItem("cart",JSON.stringify(tempCart));
        },
        removeAllCart: (state,action) =>{
            state.cart = {};
            localStorage.removeItem("cart");
        }
        
    }
})

export const {addCart,removeCart,removeAllCart} = cartSlice.actions

export default cartSlice.reducer