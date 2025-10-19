import { Save } from "../Models/save.model.js";
import { asyncHandler } from "../utils/asynceHandler.js";
import { apiError } from "../utils/errorHandler.js";
import mongoose from "mongoose";
import { apiResponse } from "../utils/responseHandler.js";

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
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "newest" } = req.query;

    const pageNo = Math.max(1, Number(page));
    const maximumNoOfDocument = Math.min(50, Number(limit));
    const offset = (pageNo - 1) * maximumNoOfDocument;
    const normalizeSortType = String(sortType).toLowerCase();

    const SORT_TYPES = {
        NEWEST: "newest",
        OLDEST: "oldest"
    }

    if (!Object.values(SORT_TYPES).includes(normalizeSortType)) {
        throw new apiError(400, 'Sort Type must be "newst" or "oldest"')
    }

    // dynamic sorting
    const sortObject = {
        sortBy: normalizeSortType === SORT_TYPES.NEWEST ? 1 : -1
    }

    const totalSavedPost = (await Save.find({ savedBy: userId })).length

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
        },
        {
            $sort: sortObject
        },
        {
            $limit: maximumNoOfDocument
        },
        {
            $skip: offset
        }
    ])

    if (!existingSave) {
        throw new apiError(404, "No Saved Post Found")
    }

    const totalPages = Math.ceil(totalSavedPost / maximumNoOfDocument)

    const responseData = {
        existingSave,
        pagination: {
            currentPageNo: pageNo,
            totalSavedPost,
            maximumNoOfDocument,
            savedPostPerPage: Number(limit),
            hasNextPage: pageNo < maximumNoOfDocument,
            hasPrevPage: pageNo > 1
        }
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    responseData,
                    totalSaves: existingSave.length
                },
                "Fetched all users saved post"
            )
        )
})

// delete saved post
// const deleteSavedPost = asyncHandler(async (req, res) => {
//     // get saved post id
//     const { savedPostId } = req.params;

//     if (!savedPostId.trim() && mongoose.Types.ObjectId.isValid(savedPostId)) {
//         throw new apiError(400, "Invalid post id")
//     }

//     const deleteSavedPost = await Save.findByIdAndDelete(savedPostId)

//     if (!deleteSavedPost) {
//         throw new apiError(500, "Error while deleting the post")
//     }

//     return res
//         .status(200)
//         .json(
//             new apiResponse(
//                 200,
//                 {},
//                 "Post Deleted Successfully"
//             )
//         )
// })

export {
    toggleUserSavePost,
    getAllSavedPost
}