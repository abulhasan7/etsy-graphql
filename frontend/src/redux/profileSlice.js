import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name:'profile',
    initialState:{
        //this is the actual key that will be stored in the redux store
        profile:localStorage.getItem('profile')?JSON.parse(localStorage.getItem('profile')) : {},
    },
    reducers:{
        addProfile: (state,action) =>{
            state.profile= action.payload
            localStorage.setItem("profile",JSON.stringify(action.payload));
        }
    }
})

export const {addProfile} = profileSlice.actions

export default profileSlice.reducer