import { Post } from "../Models/post.model.js"
import { asyncHandler } from "../utils/asynceHandler.js"
import { apiResponse } from "../utils/responseHandler.js"
import { apiError } from "../utils/errorHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../Models/user.model.js"
import mongoose from "mongoose"
import { Subscription } from "../Models/subscription.model.js"
import { uploadVideoToCloudinary } from "../utils/uploadVideoToCloudinary.js"

// create post
const createPost = asyncHandler(async (req, res) => {

    console.log("Files:", req.files);

    // take details from user
    const { title, description } = req.body
    const currentUser = req.user?._id

    // validate detatils
    if ((!title?.trim() || !description?.trim())) {
        throw new apiError(400, "Title and Description is required to create a post")
    }

    console.log("title and description field test pass");

    // upload media(image/video) to cloudinary
    const images = req.files.images
    const videoPath = Array.isArray(req.files?.video) ? req.files.video[0].path : "";
    let videoData = null;
    const imageUrls = []

    console.log("obtained images and videoPath pass");

    try {
        console.log("Files received over here before uploading:", images);        
        console.log("Files received over here before uploading req.file.images[0]:", req.files.images[0]);

        if (Array.isArray(images) && images.length > 0) {
            for (const image of images) { // in is used for key in object
                console.log("uploading image:", image.path);

                let cloudinaryRes = await uploadOnCloudinary(image.path)
                if (cloudinaryRes.url) {
                    imageUrls.push(cloudinaryRes.url)
                }
            }

            console.log("All images uploaded successfully:", imageUrls);
        }
        else console.log("no image file or array");


        if (videoPath && videoPath.trim() !== "") {
            videoData = await uploadVideoToCloudinary(videoPath);
            console.log("video upload done");

        }

    } catch (error) {
        throw new apiError(500, "Error while uploading media (image/video) to cloudinary");
    }

    // creating new post
    console.log("creating new post..");

    const newPost = await Post.create({
        title,
        description,
        isPublished: true,
        images: imageUrls,
        video: videoData?.videoUrl || null,
        owner: req.user?._id
    })

    // validate the post
    if (!newPost) {
        throw new apiError(500, "Error while creating a Post")
    }

    console.log("created new post..");


    // add this post to current user -> available to their profile
    await User.findByIdAndUpdate(
        currentUser,
        {
            $push: {
                userPost: newPost?._id
            }
        },

        {
            new: true
        }
    )

    let postedToCommunities = []

    // if user subscribes to community -> and wants to post on a community
    let { communities } = req.body
    if (typeof (communities) === "string") {
        try {
            communities = JSON.parse(communities)
        } catch (error) {
            communities = []
        }
    }
    if (Array.isArray(communities) && communities.length > 0) {
        for (const communityId of communities) {
            const isSubscribed = await Subscription.findOne({
                follower: currentUser,
                channel: communityId
            })

            if (!isSubscribed) {
                throw new apiError(400, "You have not subscribed to community")
            }

            // get the community to post
            const communityToPost = await User.findByIdAndUpdate(
                communityId,
                {
                    $push: {
                        userPost: newPost?._id
                    }
                },

                {
                    new: true
                }
            )
                .populate("userPost", "title description images")
                .select("-watchHistory -password -email -gender -refreshToken -changesHistory -__v")

            postedToCommunities.push(communityToPost)
        }

    }

    // alternative apprach
    const populatedPost = await User.findById(currentUser?._id)
        .populate("userPost", "title description images")
        .select("-watchHistory -password -email -gender -refreshToken -changesHistory -__v")

    const postOwnerDetails = await Post.findById(newPost?._id)
        .populate("owner", "userName fullName avatar")
        .select("-title -description -images -video -isPublished -views -createdAt -updatedAt -__v")

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                {
                    ownerDetail: postOwnerDetails,
                    post: populatedPost,
                    postedToCommunities: [postOwnerDetails, postedToCommunities]
                },
                postedToCommunities.length > 0
                    ? "Post created and shared to communities successfully"
                    : "Post created successfully"
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


    // post to community
    // const community = await User.aggregate([
    //             {
    //                 $match: {
    //                     _id: communityId
    //                 }
    //             },

    //             {
    //                 $set: {
    //                     userPost: newPost
    //                 }
    //             },

    //             {
    //                 $lookup: {
    //                     from: "posts",
    //                     localField: "userPost",
    //                     foreignField: "owner",
    //                     as: "userPost"
    //                 }
    //             },

    //             {
    //                 $lookup: {
    //                     from: "users",
    //                     localField: "owner",
    //                     foreignField: "_id",
    //                     as: "owner"
    //                 }
    //             },

    //             {
    //                 $addFields: {
    //                     postDetails: {
    //                         $first: "$owner"
    //                     }
    //                 }
    //             }
    //         ])
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
                {
                    allPost,
                    totalPost: allPost.length
                },
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

// post to community
// const postToCommunity = asyncHandler(async (req, res) => {
//     const { communities } = req.body
//     if (condition) {

//     }
// })

export {
    createPost,
    getAllPostMadeByUser,
    updatePost,
    deletePost
}