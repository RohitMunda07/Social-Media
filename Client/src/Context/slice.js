import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false
}

export const closeSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        open: (state) => {
            state.value = true
        },
        close: (state) => {
            state.value = false
        }
    },
})

// Action creators are generated for each case reducer function
export const { open, close } = closeSlice.actions

export default closeSlice.reducer