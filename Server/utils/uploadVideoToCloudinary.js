import { uploadOnCloudinary } from "./cloudinary.js";
import { apiError } from "./errorHandler.js";

// helper function to upload video to cloudinary
export const uploadVideoToCloudinary = async (videoPath) => {
    if (!videoPath) {
        throw new apiError(400, "Video file is required")
    }

    let videoUrl;
    try {
        videoUrl = await uploadOnCloudinary(videoPath);
        if (!videoUrl.url) {
            throw new apiError(500, "Something went wrong while uploading video")
        }
    } catch (error) {
        throw new apiError(500, "Error while uploading video to cloudinary")
    }

    return {
        videoUrl: videoUrl.url,
    }
}