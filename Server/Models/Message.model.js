import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },

    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    textMessage: {
        type: String,
        default: ""
    },

    imageMessages: [
        {
            type: String
        }
    ],

    videoMessage: [
        {
            type: String
        }
    ]
}, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema)