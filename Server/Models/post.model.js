import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
        required: [true, 'Title for post is required'],
        trim: true,
    },

    description: {
        type: String,
        trim: true,
        required: [true, 'Description for post is required']
    },

    isPublished: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model('Post', postSchema)