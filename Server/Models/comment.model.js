import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    commentBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    commentOn: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    
    commentData: {
        type: String,
        required: true,
    }
}, { timestamps: true })

commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model('Comment', commentSchema)