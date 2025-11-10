import { createSlice } from "@reduxjs/toolkit";

export const likeSlice = createSlice({
    name: "like",
    initialState: {
        likedPosts: []
    },
    reducers: {
        addLikeState: (state, action) => {
            const newLike = action.payload
            if (!state.likedPosts.some((post) => post._id === newLike._id)) {
                state.likedPosts.push(newLike)
            }
        },

        removeLikeState: (state, action) => {
            const id = action.payload
            state.likedPosts = state.likedPosts.filter((post) => post._id !== id)
        },
    }
})

export const { addLikeState, removeLikeState } = likeSlice.actions

export default likeSlice.reducer


