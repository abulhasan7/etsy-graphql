import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './cartSlice'
import tokenSlice from './tokenSlice'
import currencySlice from './currencySlice'

export default configureStore({
    reducer: {tokenSlice,cartSlice,currencySlice}
})