import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from "../utils/responseHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { Like } from "../Models/like.modle.js";
import mongoose from "mongoose";

// toggle like state -> comment and post like
const toggleLike = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.query
    if (postId && !mongoose.Types.ObjectId.isValid(postId)) {
        throw new apiError(400, "Invalid post ID");
    }

    if (commentId && !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    let isPostLiked = false;
    let isCommentLiked = false;
    const currentUser = req.user?._id

    let newLikeOnPost = null
    let aggregatePost = null

    if (postId) {
        // toggle like on Post
        const existingLikeOnPost = await Like.findOne({
            likedBy: currentUser,
            likedOnPost: postId
        })

        if (!existingLikeOnPost) {
            newLikeOnPost = await Like.create({
                likedBy: currentUser,
                likedOnPost: postId
            })

            isPostLiked = true;

            aggregatePost = await Like.aggregate([
                {
                    $match: { _id: newLikeOnPost._id }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "likedBy",
                        foreignField: "_id",
                        as: "likedBy"
                    }
                },
                {
                    $addFields: {
                        likedBy: { $first: "$likedBy" }
                    }
                },
                {
                    $project: {
                        "likedBy.userName": 1,
                        "likedBy.avatar": 1
                    }
                }

            ])

        } else {
            await Like.findByIdAndDelete(existingLikeOnPost?._id)
            isPostLiked = false;
        }

    }


    let newLikeOnComment = null;
    let aggregateComment = null;
    if (commentId) {
        // toggle like on Comment
        const existingLikeOnComment = await Like.findOne({
            likedBy: currentUser,
            likedOnComment: commentId
        })

        if (!existingLikeOnComment) {
            newLikeOnComment = await Like.create({
                likedBy: currentUser,
                likedOnComment: commentId
            })

            isCommentLiked = true;

            aggregateComment = await Like.aggregate([
                {
                    $match: { _id: newLikeOnComment._id }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "likedBy",
                        foreignField: "_id",
                        as: "likedBy"
                    }
                },
                {
                    $addFields: {
                        likedBy: { $first: "$likedBy" }
                    }
                },
                {
                    $project: {
                        "likedBy.userName": 1,
                        "likedBy.avatar": 1
                    }
                }

            ])

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
                    postLike: isPostLiked ? aggregatePost : null,
                    commentLike: isCommentLiked ? aggregateComment : null
                },
                isPostLiked
                    ? "Post like toggled successfully"
                    : isCommentLiked
                        ? "Comment like toggled successfully"
                        : "No like action performed"
            )
        )
})

// get all likes


export {
    toggleLike
}