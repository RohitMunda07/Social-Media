import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String
    }
}, { timestamps: true })

export const Chat = mongoose.model('Like', chatSchema)
