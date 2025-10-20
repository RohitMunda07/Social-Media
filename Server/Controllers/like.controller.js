import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from "../utils/responseHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { Like } from "../Models/like.modle.js";
import mongoose from "mongoose";

// toggle like state -> comment and post like
const toggleLike = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params
    if (postId && !mongoose.Types.ObjectId.isValid(postId)) {
        throw new apiError(400, "Invalid post ID");
    }

    if (commentId && !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    let isPostLiked = false;
    let isCommentLiked = false;
    const currentUser = req.user?._id

    if (postId) {
        // toggle like on Post
        const existingLikeOnPost = await Like.findOne({
            likedBy: currentUser,
            likedOnPost: postId
        })

        let newLikeOnPost = null
        if (!existingLikeOnPost) {
            newLikeOnPost = await Like.create({
                likedBy: currentUser,
                likedOnPost: postId
            })

            isPostLiked = true;

        } else {
            await Like.findByIdAndDelete(existingLikeOnPost?._id)
            isPostLiked = false;
        }

    }

    if (commentId) {
        // toggle like on Comment
        const existingLikeOnComment = await Like.findOne({
            likedBy: currentUser,
            likedOnComment: commentId
        })

        let newLikeOnComment = null;
        if (!existingLikeOnComment) {
            newLikeOnComment = await Like.create({
                likedBy: currentUser,
                likedOnComment: commentId
            })

            isCommentLiked = true;

        } else {
            await Like.findByIdAndDelete(existingLikeOnComment?._id)
            isCommentLiked = false;
        }
    }


    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    postLike: isPostLiked ? newLikeOnPost : null,
                    commentLike: isCommentLiked ? newLikeOnComment : null
                },
                isPostLiked
                    ? "Post like toggled successfully"
                    : isCommentLiked
                        ? "Comment like toggled successfully"
                        : "No like action performed"
            )
        )
})

export {
    toggleLike
}