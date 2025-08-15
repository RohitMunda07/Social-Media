import mongoose, { Schema } from "mongoose"

const schema = new Schema({
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    comment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    },

    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },

    video: {
        type: mongoose.Types.ObjectId,
        ref: "Video"
    }
}, { Timestamp: true })

export const Like = mongoose.model('Like', schema)