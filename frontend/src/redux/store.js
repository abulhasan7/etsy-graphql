import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './cartSlice'
import tokenSlice from './tokenSlice'

export default configureStore({
    reducer: {tokenSlice,cartSlice}
})