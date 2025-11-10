import { createSlice } from "@reduxjs/toolkit";

export const saveSlice = createSlice({
    name: "save",
    initialState: {
        saveState: []
    },
    reducers: {
        addSave: (state, action) => {
            const newSavePost = action.payload
            if (!newSavePost || !newSavePost.savedPost) return; // ✅ ignore nulls

            const isSavedPost = state.saveState.some((post) => post?.savedPost === newSavePost?.savedPost)

            if (!isSavedPost) {
                state.saveState.push(newSavePost)
            }
        },

        removeSavedPost: (state, action) => {
            const id = action.payload
            state.saveState = state.saveState.filter((post) => post?.savedPost !== id)
        }
    }
})

export const { addSave, removeSavedPost } = saveSlice.actions

export default saveSlice.reducer