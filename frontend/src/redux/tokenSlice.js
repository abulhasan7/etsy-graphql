import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
    name:'token',
    initialState:{
        //this is the actual key that will be stored in the redux store
        token:localStorage.getItem('token'),
    },
    reducers:{
        addToken: (state,action) =>{
            state.token= action.payload
        }
    }
})

export const {addToken} = tokenSlice.actions

export default tokenSlice.reducer