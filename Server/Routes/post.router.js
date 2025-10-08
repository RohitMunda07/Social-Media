import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import {
    createPost,
    deletePost,
    getAllPostMadeByUser,
    updatePost
} from "../Controllers/post.controller.js";


const router = Router()

router.route("/create").post(
    verifyJWT,
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "video", maxCount: 1 }
    ]),
    createPost
)

router.route("/get-users-all-post").get(verifyJWT, getAllPostMadeByUser)

router.route("/update-post/:postId").patch(
    verifyJWT,
    upload.array("images"),
    updatePost
)

router.route("/delete-post/:postId").delete(verifyJWT, deletePost)

export default router
