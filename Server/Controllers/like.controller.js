import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from "../utils/responseHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { Like } from "../Models/like.modle.js";
import mongoose from "mongoose";

// toggle like state -> comment and post like
const toggleLike = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
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
                    postId,
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
// get user's all liked content (posts + comments)
const getAllLikes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const { page = 1, limit = 10, sortType = "newest" } = req.query;

    const pageNo = Math.max(1, Number(page));
    const maximumNoOfDocument = Math.min(50, Number(limit));
    const offset = (pageNo - 1) * maximumNoOfDocument;

    const normalizeSortType = String(sortType).toLowerCase();

    const SORT_TYPES = {
        NEWEST: "newest",
        OLDEST: "oldest",
    };

    if (!Object.values(SORT_TYPES).includes(normalizeSortType)) {
        throw new apiError(400, 'Sort type must be "newest" or "oldest"');
    }

    // sorting
    const sortObject = {
        createdAt: normalizeSortType === SORT_TYPES.NEWEST ? -1 : 1
    };

    // total count
    const totalLikes = await Like.countDocuments({ likedBy: userId });

    const allLikes = await Like.aggregate([
        {
            $match: { likedBy: userId }
        },

        // populate post (if likedOnPost exists)
        {
            $lookup: {
                from: "posts",
                localField: "likedOnPost",
                foreignField: "_id",
                as: "postDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    { $addFields: { owner: { $first: "$owner" } } },
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            images: 1,
                            video: 1,
                            "owner.userName": 1,
                            "owner.fullName": 1,
                            "owner.avatar": 1
                        }
                    }
                ]
            }
        },

        // populate comment (if likedOnComment exists)
        {
            $lookup: {
                from: "comments",
                localField: "likedOnComment",
                foreignField: "_id",
                as: "commentDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    { $addFields: { owner: { $first: "$owner" } } },
                    {
                        $project: {
                            content: 1,
                            "owner.userName": 1,
                            "owner.fullName": 1,
                            "owner.avatar": 1
                        }
                    }
                ]
            }
        },

        {
            $project: {
                likedBy: 1,
                likedOnPost: 1,
                likedOnComment: 1,
                postDetails: 1,
                commentDetails: 1
            }
        },

        { $sort: sortObject },
        { $skip: offset },
        { $limit: maximumNoOfDocument }
    ]);

    if (!allLikes.length) {
        throw new apiError(404, "No likes found");
    }

    const totalPages = Math.ceil(totalLikes / maximumNoOfDocument);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                likes: allLikes,
                pagination: {
                    currentPage: pageNo,
                    totalLikes,
                    likesPerPage: maximumNoOfDocument,
                    hasNextPage: pageNo < totalPages,
                    hasPrevPage: pageNo > 1
                }
            },
            "Fetched all likes"
        )
    );
});


export {
    toggleLike,
    getAllLikes
}