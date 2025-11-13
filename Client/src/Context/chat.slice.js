import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        user: {
            _id: "",
            userName: "",
            fullName: "",
            avatar: ""
        }
    },
    reducers: {
        updateChatDetails: (state, action) => {
            state.user = {
                ...state.user,
                _id: action.payload?._id,
                userName: action.payload?.userName,
                fullName: action.payload?.fullName,
                avatar: action.payload?.avatar
            }
            console.log("current user to chat:", state.user);
        }
    }
})

export const { updateChatDetails } = chatSlice.actions;

export default chatSlice.reducer
