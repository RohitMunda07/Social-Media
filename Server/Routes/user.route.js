import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import {
    registerUser,
    loginUser,
    // searchQuery,
    logoutUser,
    updateAccessToken,
    updateUserPassword
} from "../Controllers/user.controller.js"

const router = Router();
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(updateAccessToken)
router.route("/update-password").put(verifyJWT, updateUserPassword)
// router.route("/search").get(searchQuery)

export default router
