// import { asyncHandler } from "../utils/asynceHandler.js";
// import { apiError } from "../utils/errorHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../Models/user.model.js";

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header(
//             ("Authorization")?.replace("Bearer", "")
//         )
//         if (!token) {
//             throw new apiError(401, "Unautorized Request")
//         }
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const user = await User.findById(decodedToken._id).select("-password -refreshToken")
//         if (!user) {
//             throw new apiError(404, "User Not Found")
//         }
//         req.user = user
//         next();

//     } catch (error) {
//         throw new apiError(401, error?.message || "Invalid Access Token")
//     }

// })


import { asyncHandler } from "../utils/asynceHandler.js";
import { apiError } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

// -------------------------
// AUTH MIDDLEWARE
// -------------------------
export const verifyJWT = asyncHandler(async (req, res, next) => {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new apiError(401, "Not authenticated: No token provided");
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user in DB
        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            throw new apiError(404, "User not found");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        throw new apiError(401, "Invalid or expired token");
    }
});

