import { asyncHandler } from "../utils/asynceHandler.js";
import { apiError } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header(
            ("Authorization")?.replace("Bearer", "")
        )
        if (!token) {
            throw new apiError(401, "Unautorized Request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if (!user) {
            throw new apiError(404, "User Not Found")
        }
        req.user = user
        next();

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token")
    }
})
