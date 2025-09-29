import { createSlice } from "@reduxjs/toolkit";
import { useState } from "react";

const initialAuth = localStorage.getItem("auth") === "true"

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        authStatus: initialAuth, // Redux starts with localStorage value
    },
    reducers: {
        toggleAuthStatus: (state) => {
            state.authStatus = !state.authStatus;
            localStorage.setItem("auth", state.authStatus)
        },

        setAuthStatus: (state, action) => {
            state.authStatus = action.payload
            localStorage.setItem("auth", action.payload)
        }
    }
})

// console.log("AuthStatus:", initialState.authStatus);

// Action creators are generated for each case reducer function
export const { toggleAuthStatus, setAuthStatus } = authSlice.actions

export default authSlice.reducer 