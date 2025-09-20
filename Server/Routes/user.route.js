import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import {
    registerUser,
    loginUser,
    // searchQuery,
    logoutUser,
    updateAccessToken,
    updateUserPassword,
    updateUserProfile,
    getCurrentUser,
    updateUserCoverImage,
    updateUserAvatar
} from "../Controllers/user.controller.js"
import { upload } from "../Middleware/multer.middleware.js";

const router = Router();
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(updateAccessToken)
router.route("/update-password").put(verifyJWT, updateUserPassword)
router.route("/update-user-profile").patch(verifyJWT, updateUserProfile)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)
router.route("/update-avatar-image").patch(verifyJWT, upload.single('avatar'), updateUserAvatar)
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// router.route("/search").get(searchQuery)

export default router
