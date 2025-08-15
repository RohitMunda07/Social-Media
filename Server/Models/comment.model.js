import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    commentBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    commentOn: {
        type: mongoose.Types.ObjectId,
        ref: "Post"
    },
}, { timestamps: true })

commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model('Comment', commentSchema)