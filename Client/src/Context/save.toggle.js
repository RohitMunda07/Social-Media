import { useDispatch, useSelector } from "react-redux";
import { addSave, removeSavedPost } from "./save.slice.js";
import { post } from "../APIs/api.js";

export const toggleSave = (postId) => async (dispatch, getState) => {
    try {
        const res = await post(`save/save-post/${postId}`, {
            params: {
                postId: postId
            },
        })
        console.log("api saved", res.data.data);
        const data = res.data.data;
        const savedPost = Array.isArray(data) ? data[0] : data;

        // Safety check before using it
        if (!savedPost || !savedPost._id) {
            console.warn("Invalid save data received:", savedPost);
            // return; // don’t dispatch anything
        }

        const state = getState();
        console.log("getState:", state);

        const alreadyExist = state.save.saveState.some((p) => p?.savedPost === postId)

        if (alreadyExist && alreadyExist !== null) {
            dispatch(removeSavedPost(postId))
        } else {
            dispatch(addSave(savedPost))
        }

    } catch (error) {
        console.log("full error:", error);
        console.log(error?.response?.data?.message || "error from front-end in saving the post");
    }
}

// how the data is received from the backend
// console.log("api saved at 0", res.data.data?.[0]?.postDetails?.description);
// extract data's form the backend