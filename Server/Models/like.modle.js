import mongoose, { Schema } from "mongoose"

const likeSchema = new Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    likedOnComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    likedOnPost: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },

    // video: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Video"
    // }
    
}, { Timestamp: true })

export const Like = mongoose.model('Like', likeSchema)