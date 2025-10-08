import { asyncHandler } from "../utils/asynceHandler.js";
import { apiResponse } from '../utils/responseHandler.js'
import { apiError } from "../utils/errorHandler.js";
import { Video } from "../Models/videos.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// upload video to post
const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const videoPath = req.files?.video[0]?.path
    const thumbnailPath = req.files?.thumbnail[0].path

    if (!title.trim() || !description.trim()) {
        throw new apiError(400, "Title and Description is required")
    }

    if (!videoPath || !thumbnailPath) {
        throw new apiError(400, "Video and thumbnail is required")
    }

    // upload files to cloudinary
    let videoUrl;
    let thumbnailUrl;

    try {
        videoUrl = await uploadOnCloudinary(videoPath)
        if (!videoUrl.url) {
            throw new apiError(500, "Error while uploading video to cloudinary")
        }

        thumbnailUrl = await uploadOnCloudinary(thumbnailPath)
        if (!thumbnailUrl.url) {
            throw new apiError(500, "Error while uploading video to cloudinary")
        }

    } catch (error) {
        throw new apiError(500, "Sonthing went wrong while uploading video and thumbnail to cloudinary")
    }

    // create video object
    const video = await Video.create(
        {
            owner: req.user?._id,
            title,
            description,
            thumbnail: thumbnailUrl.url,
            videoLink: videoUrl.url,
            isPublished: true,
            duration: videoUrl.duration
        }
    )

    if (!video) {
        throw new apiError(400, "Something when wrong create video entity")
    }

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                video,
                "Video Uploaded Successfull"
            )
        )

})

// get user's all video
const getUsersAllVideo = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const allVideos = await Video.find({ owner: userId })

    if (!allVideos) {
        throw new apiError(500, "Something went wrong will uploading video")
    }

    return res 
        .status(200)
        .json(
            new apiResponse(
                200,
                allVideos,
                "Fetched all video Successfully"
            )
        )
})

const testVideo = asyncHandler(async (_, res) => {
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "test video successfull",
            )
        )
})

export {
    uploadVideo,
    testVideo,
    getUsersAllVideo
}