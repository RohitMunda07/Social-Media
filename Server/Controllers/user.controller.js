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

// logout user

// getUserProfile

// update user Profile

// update avatar

// update user details -> email, password

// save post

// share post


export {
    registerUser
}