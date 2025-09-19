import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
        required: true,
        inndex: true,
    },

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

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

    phoneNumber: {
        type: Number,
    },

    gender: {
        type: String,
        default: "None"
    },

    avatar: {
        type: String, // cloudinary string
    },

    savedPost: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },

    changesHistory: [
        {
            field: { type: String, required: true },
            oldValue: { type: String },
            newValue: { type: String },
            updatedAt: { type: Date, default: Date.now }
        }
    ],

    refreshToken: {
        type: String
    }

},
    { Timestamp: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

// this is function is called at the time of login
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            // data to store with access token
            // fieldName: dataBase_field
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            // it is similar to refresh token but it consist of few data since it get refresh frequently
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        if (ret.changesHistory) {
            ret.changesHistory = ret.changesHistory.map(log => ({
                ...log,
                updatedAt: log.updatedAt.toString()
            }));
        }
        return ret;
    }
});

export const User = mongoose.model('User', userSchema)