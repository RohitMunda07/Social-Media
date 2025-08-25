import mongoose, { Schema } from "mongoose"

const likeSchema = new Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },

    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
    
}, { Timestamp: true })

export const Like = mongoose.model('Like', likeSchema)