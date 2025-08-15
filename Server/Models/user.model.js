import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        index: true // searchable
    },

    fullName: {
        type: String,
        trim: true,
        required: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowerCase: true,
        trim: true
    },

    avatar: {
        type: String, // cloudinary string
    },

    savedPost: {
        type: mongoose.Types.ObjectId,
        ref: "Post"
    },

    refreshToken: {
        type: String
    }

},
    { Timestamp: true })

export const User = mongoose.model('User', userSchema)