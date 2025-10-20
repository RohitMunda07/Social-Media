import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from "../utils/responseHandler.js"
import { apiError } from "../utils/errorHandler.js"
import { Comment } from "../Models/comment.model.js"
import mongoose from "mongoose"

// create comment
const createComment = asyncHandler(async (req, res) => {
    // get comment 
    const { comment } = req.body;
    const { postId } = req.params

    // validate comment
    if (!comment) {
        throw new apiError(400, "content can't be empty")
    }

    // create new comment
    const currentUser = req.user?._id
    const newComment = await Comment.create({
        commentBy: currentUser,
        commentOn: postId,
        commentData: comment
    })

    if (!newComment) {
        throw new apiError(500, "Something went wrong while creating comment")
    }

    const getComment = await Comment.aggregate([
        {
            $match: {
                commentBy: new mongoose.Types.ObjectId(currentUser),
                commentOn: new mongoose.Types.ObjectId(postId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "commentBy",
                foreignField: "_id",
                as: "owner"
            },

        },

        {
            $addFields: {
                owner: { $first: "$owner" }
            },

        },

        {
            $project: {
                "owner.userName": 1,
                "owner.avatar": 1
            }
        }
    ])

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                getComment,
                "Comment Made Successfull"
            )
        )
})

// get all comments made by user
const getAllComment = asyncHandler(async (req, res) => {
    const currentUser = req.user?._id

    // get comment from DB
    const comments = await Comment.find({ commentBy: currentUser })
        .populate("commentBy", "userName avatar")
        .populate("commentOn", "title description images video views")
        .select("-createdAt -updatedAt -__v")

    if (comments.length === 0) {
        throw new apiError(404, "comments not found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                201,
                comments,
                "Fetched All Comments Successfully"
            )
        )
})

// delet comment
const deletComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId.trim() && !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new apiError(400, "Invalid comment Id")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (!deletedComment) {
        throw new apiError(500, "Error while deleting this comment")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Comment Deleted Successfully"
            )
        )
})

export {
    createComment,
    getAllComment,
    deletComment
}