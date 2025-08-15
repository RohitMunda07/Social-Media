import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const saveSchema = new Schema({
    savedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    savedPost: {
        type: mongoose.Types.ObjectId,
        ref: "Post"
    },

}, { timestamps: true })

saveSchema.plugin(mongooseAggregatePaginate)
export const Save = mongoose.model('Save', saveSchema)