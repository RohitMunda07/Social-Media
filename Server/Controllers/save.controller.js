import { Save } from "../Models/save.model.js";
import { asyncHandler } from "../utils/asynceHandler.js";
import { apiError } from "../utils/errorHandler.js";
import { Post } from "../Models/post.model.js";
import mongoose from "mongoose";
import { apiResponse } from "../utils/responseHandler.js";
import { title } from "process";

// toggle user's post 
const toggleUserSavePost = asyncHandler(async (req, res) => {
    const currentUser = req.user?._id;
    const { postId } = req.params;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        throw new apiError(400, "Invalid Post Id or Post does not exist")
    }

    // check if the post is saved or not
    const existingSavePost = await Save.findOne({ savedBy: currentUser, savedPost: postId });
    console.log("existing save:", existingSavePost);

    let newPost;
    let isSave = false;
    if (existingSavePost) {
        newPost = await Save.findByIdAndDelete(existingSavePost?._id)
        console.log("deleted save:", newPost);
        isSave = false;

    } else {
        newPost = await Save.create({
            savedBy: currentUser,
            savedPost: postId
        })

        if (!newPost) {
            throw new apiError(500, "Error while saving the post")
        }
        console.log("Post Saved: ", newPost);
        isSave = true;
    }


    let aggregateSavedPost = null;
    if (isSave) {
        aggregateSavedPost = await Save.aggregate([
            {
                $match: {
                    savedBy: new mongoose.Types.ObjectId(currentUser),
                    savedPost: new mongoose.Types.ObjectId(postId)
                }
            },
            // get owner details of post
            {
                $lookup: {
                    from: "posts",
                    localField: "savedPost",
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
                        {
                            $addFields: {
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        },
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
            {
                $addFields: {
                    postDetails: {
                        $first: "$postDetails"
                    }
                }
            },
            {
                $project: {
                    savedBy: 1,
                    savedPost: 1,
                    postDetails: 1
                }
            }
        ])
    }


    console.log("Aggregate value:", aggregateSavedPost);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                aggregateSavedPost,
                `${isSave ? "Post Saved Successfull" : "Post remove from saved"}`
            )
        )
})

// get user's all saved post
const getAllSavedPost = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const existingSave = await Save.aggregate([
        {
            $match: { savedBy: userId }
        },
        {
            $lookup: {
                from: "posts",
                localField: "savedPost",
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
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    },
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
        {
            $project: {
                savedBy: 1,
                savedPost: 1,
                postDetails: 1
            }
        }
    ])

    if (!existingSave) {
        throw new apiError(404, "No Saved Post Found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    existingSave,
                    totalSaves: existingSave.length
                },
                "Fetched all users saved post"
            )
        )
})

export {
    toggleUserSavePost,
    getAllSavedPost
}