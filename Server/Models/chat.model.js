import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },

    lastMessagePreview: {
        type: String
    }

}, { timestamps: true })

export const Chat = mongoose.model('Chat', chatSchema)
