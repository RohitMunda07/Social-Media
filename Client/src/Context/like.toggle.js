import { put } from "../APIs/api.js";
import { addLikeState, removeLikeState } from "./like.slice.js";
import { useSelector, useDispatch } from "react-redux";

export const toggleLike = (postId) => async (dispatch) => {

    try {
        const res = await put(
            `like/toggle-like`,
            {},
            {
                params: { postId },
                withCredentials: true,
            }
        );

        const data = res.data.data
        console.log(data);

        // extract likedPost from the data received from backend
        const likedPost = data?.postLike?.[0]

        if (likedPost) {
            dispatch(addLikeState(likedPost))
            console.log("likedPosts:", likedPost);
        } else {
            dispatch(removeLikeState(postId))
            // const likedPost = useSelector((state) => state.like.likedPosts)
            // console.log("likedPosts:", likedPost);
        }
    } catch (error) {
        console.log("Full error:", error);
        console.log(error?.response?.data?.message || "Error in toggle like front-end");
    }
}
