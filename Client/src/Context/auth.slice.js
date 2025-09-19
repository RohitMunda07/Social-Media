import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    authStatus: true
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        toggleAuthStatus: (state) => {
            state.authStatus = !state.authStatus;
        }
    }
})

console.log("AuthStatus:", initialState.authStatus);

// Action creators are generated for each case reducer function
export const { toggleAuthStatus } = authSlice.actions

export default authSlice.reducer 