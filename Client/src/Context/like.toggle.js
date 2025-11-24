import { post } from "../APIs/api.js";
import { addLikeState, removeLikeState } from "./like.slice.js";

export const toggleLike = ({ postId = null, commentId = null }) =>
    async (dispatch, getState) => {
        try {
            console.log("post id received to like", postId);
            const res = await post(`like/toggle-like/${postId}`, null, {
                params: { commentId }
            });

            const { postLike, commentLike } = res.data.data;

            console.log("API Like Response:", { postLike, commentLike });

            const state = getState();
            console.log("getState:", state);

            // --- POST LIKE TOGGLED ---
            if (postId) {
                if (postLike) {
                    dispatch(addLikeState(postLike));
                    console.log("Post Liked:", postLike);
                } else {
                    dispatch(removeLikeState(postId));
                    console.log("Post Unliked:", postId);
                }
            }

            // --- COMMENT LIKE TOGGLED ---
            if (commentId) {
                if (commentLike) {
                    dispatch(addLikeState({ type: "comment", data: commentLike }));
                    console.log("Comment Liked:", commentLike);
                } else {
                    dispatch(removeLikeState({ type: "comment", id: commentId }));
                    console.log("Comment Unliked:", commentId);
                }
            }

        } catch (error) {
            console.error("Full Error:", error);
            console.error(
                error?.response?.data?.message ||
                "Error in toggle like front-end"
            );
        }
    };
