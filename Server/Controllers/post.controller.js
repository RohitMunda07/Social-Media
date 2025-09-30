import { Post } from "../Models/post.model.js"
import { asyncHandler } from "../utils/asynceHandler.js"
import { apiResponse } from "../utils/responseHandler.js"
import { apiError } from "../utils/errorHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"

// create post
const createPost = asyncHandler(async (req, res) => {
    // take details from user
    const { title, description, communities } = req.body
    const images = req.files


    // validate detatils
    if ((!title?.trim() || !description?.trim())) {
        throw new apiError(400, "Title and Description is required to create a post")
    }

    // upload image to cloudinary
    const imageUrls = []
    try {
        if (Array.isArray(images) && images.length > 0) {
            for (const image of images) { // in is used for key in object
                let cloudinaryRes = await uploadOnCloudinary(image.path)
                if (cloudinaryRes.url) {
                    imageUrls.push(cloudinaryRes.url)
                }
            }
        }

    } catch (error) {
        throw new apiError(500, "Error while uploading Image to cloudinary")
    }

    // creating new post
    const newPost = await Post.create({
        title,
        description,
        isPublished: true,
        images: imageUrls,
        owner: req.user?._id
    })

    if (!newPost) {
        throw new apiError(500, "Error while creating a Post")
    }

    // alternative apprach
    const populatedPost = await Post.findById(newPost?._id)
        .populate("owner", "userName fullName avatar")
        .lean()

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                populatedPost,
                "Post Created Successfully"
            )
        )

    // const post = await Post.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(newPost?._id)
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "owner",
    //             foreignField: "_id",
    //             as: "owner"
    //         }
    //     },
    //     {
    //         $addFields: {
    //             owner: {
    //                 $first: "$owner"
    //             }
    //         }
    //     }
    // ])
})

// get all posts made by user
const getAllPostMadeByUser = asyncHandler(async (req, res) => {
    // get current user
    const user = req.user?._id
    const allPost = await Post.find({
        owner: user
    }).populate("owner", "userName fullName avatar")

    if (!allPost) {
        throw new apiError(404, "No post found")
    }

    // this is necessar because if there is no post then .find() will return an empty array
    if (allPost.length === 0) {
        return res
            .status(200)
            .json(new apiResponse(200, [], "No posts found for this user"));
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                allPost,
                "Fetched all Posts Successfully"
            )
        )
})

// update post
const updatePost = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const { postId } = req.params

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        throw new apiError(403, "Invalid Post Id")
    }

    const newImages = req.files
    let newImageUrls = [];

    if (Array.isArray(newImages) && newImages.length > 0) {
        try {
            for (const image of newImages) {
                let upload = await uploadOnCloudinary(image.path)
                if (upload?.url) {
                    newImageUrls.push(upload?.url)
                }
            }

        } catch (error) {
            throw new apiError(500, "Error while uploading files to cloudinary")
        }
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(newImageUrls.length > 0 && { images: newImageUrls })
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPost,
                "Post Updated Successfully"
            )
        )
})

// delete post
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params // if we don't use {} it will throw and error
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        throw new apiError(403, "Invalid Post Id")
    }

    const existingPost = await Post.findById(postId)
    if (!existingPost) {
        throw new apiError(404, "Post Not Found")
    }

    const deletedPost = await Post.findOneAndDelete(existingPost?._id)

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    title: deletedPost.title,
                    description: deletedPost.description
                },
                "Post Deleted SuccessFully"
            )
        )
})

export {
    createPost,
    getAllPostMadeByUser,
    updatePost,
    deletePost
}