import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedUser: {
            _id: "",
            userName: "",
            fullName: "",
            avatar: ""
        },
        chatId: ""
    },
    reducers: {
        updateChatDetails: (state, action) => {
            state.selectedUser = {
                ...state.selectedUser,
                _id: action.payload?._id,
                userName: action.payload?.userName,
                fullName: action.payload?.fullName,
                avatar: action.payload?.avatar
            }
            console.log("current selected User to chat:", state.selectedUser);
        },

        updateChatId: (state, action) => {
            const id = action.payload
            state.chatId = id
            console.log("update the chatId in redux", state.chatId);
        },

        updateSenderAndReceiverId: (state, action) => {
            state.senderAndReceiverId.senderId = action.payload?.senderId
            state.senderAndReceiverId.receiverId = action.payload?.receiverId
        }
    }
})

export const { updateChatDetails, updateChatId, updateSenderAndReceiverId } = chatSlice.actions;

export default chatSlice.reducer
