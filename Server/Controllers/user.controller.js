import { asyncHandler } from '../utils/asynceHandler.js'
import { User } from '../Models/user.model.js'
import { apiError } from '../utils/errorHandler.js'
import { apiResponse } from '../utils/responseHandler.js'

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

    if (!user) {
        throw new apiError(500, 'Error while creating user')
    }
    console.log(`email is ${email}, password is ${password}`);

    return res.status(201).json(
        new apiResponse(
            201,
            user,
            'User Created SuccessFully'
        )
    )
})

// login user
const loginUser = asyncHandler(async (req, res) => {
    // get user data
    const { email, password } = req.body;

    // validate the data
    if (!email || !password) {
        throw new apiError(403, "Email and Password is Required")
    }

    // check for data field is empty
    if ([email, password].some((field) => field.trim() === "")) {
        throw new apiError("Field can't be empty")
    }

    const existUser = await User.find({
        email: email
    })

    if (!existUser) {
        throw new apiError(404, `User with email ${email} Not found`);
    }

    return res.status(200).json(
        new apiResponse(
            201,
            existUser,
            "User Logged In Successfully"
        )
    )
})

// logout user


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
    searchQuery
}