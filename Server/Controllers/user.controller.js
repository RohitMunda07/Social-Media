import { asyncHandler } from '../utils/asynceHandler.js'
import { User } from '../Models/user.model.js'
import { apiError } from '../utils/errorHandler.js'
import { apiResponse } from '../utils/responseHandler.js'
import jwt, { decode } from "jsonwebtoken"
import { use } from 'react'
import { addChangeLog } from '../utils/addChangeLog.js'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh token")
    }
}

//  register user
const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(401, "Email and Password are required!")
    }

    // check for data field is empty
    if ([email, password].some((field) => field.trim() === "")) {
        throw new apiError("Field can't be empty")
    }

    // existancy check on database
    const existUser = await User.findOne({
        email: email
    })

    if (existUser) {
        throw new apiError(403, `User with email ${email} already exist`)
    }

    const fullName = email.split('@')[0]
    const userName = "s/" + fullName
    const user = await User.create({
        userName,
        fullName,
        email,
        password
    })

    const isUser = await User.findById(user._id).select("-password -refreshToken")

    if (!isUser) {
        throw new apiError(500, 'Error while creating user')
    }
    // console.log(`email is ${email}, password is ${password}`);

    return res.status(201).json(
        new apiResponse(
            201,
            isUser,
            'User Created SuccessFully'
        )
    )
})

// login user
const loginUser = asyncHandler(async (req, res) => {
    // get user data
    const { email_UserName, password } = req.body;

    // validate the data
    if (!email_UserName || !password) {
        throw new apiError(403, "Email and Password is Required")
    }

    // check for data field is empty
    if ([email_UserName, password].some((field) => field.trim() === "")) {
        throw new apiError("Field can't be empty")
    }

    const existUser = await User.findOne({
        $or: [{ email: email_UserName }, { userName: email_UserName }]
    })

    if (!existUser) {
        throw new apiError(404, `User Not found`);
    }

    const isValidPassword = await existUser.isPasswordCorrect(password);
    // const isValidPassword = await bcrypt.compare(password, existUser.password);
    if (!isValidPassword) {
        throw new apiError(403, "Invalid Password")
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existUser._id);
    console.log("after accessToken: ", accessToken);
    console.log("after refreshToken: ", refreshToken);

    const user = await User.findById(existUser._id)
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user,
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

// logout user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findOneAndUpdate(
        req.user._id,
        {
            $set: { accessToken: undefined }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User Logout Successfully")
        )
})

// update AccessToken
const updateAccessToken = asyncHandler(async (req, res) => {
    // get refresh token from user through cookies
    const incommingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    // we need to update the token only when user's token is expired i.e no Access Token
    if (!incommingRefreshToken) {
        throw new apiError(401, "Unauthorized Request")
    }

    try {

        // decode the refresh token
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // find user by id present in decodedToken
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new apiError(401, "Invalid Refresh Token to find user")
        }

        if (incommingRefreshToken !== user.refreshToken) {
            throw new apiError(404, "refreshToken is expired")
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user?._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Updated Successfully"
                )
            )

    } catch (error) {
        throw new apiError(401, "Invalid Refresh Token", error?.message)
    }
})

const updateUserPassword = asyncHandler(async (req, res) => {
    // get odd from user
    const { oldPassword, newPassword } = req.body

    // existance check
    if (!oldPassword || !newPassword) {
        throw new apiError(400, "Password fields are required")
    }

    // find the current user 
    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new apiError(404, "Unauthorized Request user not found")
    }

    // check the old password form database
    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isOldPasswordCorrect) {
        throw new apiError(403, "Old password is wrong")
    }

    if (oldPassword === newPassword) {
        throw new apiError(403, "New Password can't be same as old")
    }

    // update the change history log
    // addChangeLog(user, "Password", "****", "*****")

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user,
                "Password Update Successfully"
            )
        )

})

// update user Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { userName, fullName, email, phoneNumber, password, gender } = req.body;
    if (userName || fullName || !email || !phoneNumber || password || gender) {
        throw new apiError(403, "Fields are required")
    }

    if ([userName, fullName, email, phoneNumber, password, gender].some((field) => field.trim() === "")) {
        throw new apiError(403, "Field can't be empty")
    }

    const updatedUser = await User.findOneAndUpdate({
        userName,
        fullName,
        email,
        password,
        phoneNumber,
        gender
    })

    if (!updatedUser) {
        throw new apiError(500, "Error in updating details")
    }

    return res.send(200).json(
        new apiResponse(
            200,
            updatedUser,
            "Details updated Successfully"
        )
    )

})
// getUserProfile

// search user based on username and fullname
const searchQuery = asyncHandler(async (req, res) => {
    // user's search data
    const { searchData = "" } = req.query

    // field validation
    if (!searchData) {
        throw new apiError(403, "Search field can't be empty")
    }

    const users = await User.find({
        $or: [
            { userName: { $regex: searchData, $options: "i" } },
            { fullName: { $regex: searchData, $options: "i" } }
        ]
    })

    if (!findDataOnDb || findDataOnDb.length === 0) {
        throw new apiError(404, `Search for ${searchData} not found`)
    }

    return res.status(200).json(
        new apiResponse(
            200,
            findDataOnDb,
            `Results realted to ${searchData}`
        )
    )
})

// update avatar

// update user details -> email, password

// save post

// share post


export {
    registerUser,
    loginUser,
    logoutUser,
    updateAccessToken,
    updateUserPassword,
}