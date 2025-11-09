import { configureStore } from '@reduxjs/toolkit'
import popupReducer from './slice.js'
import authReducer from './auth.slice.js'
import likeSlice from './like.slice.js'

export const store = configureStore({
    reducer: {
        popup: popupReducer,
        auth: authReducer,
        like: likeSlice,
    },
})