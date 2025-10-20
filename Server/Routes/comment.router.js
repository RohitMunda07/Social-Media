import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import {
    createComment,
    deletComment,
    getAllComment
} from "../Controllers/comment.controller.js";

const router = Router()

router.route("/create-comment/:postId").post(verifyJWT, createComment)
router.route("/get-all-comments").get(verifyJWT, getAllComment)
router.route("/delete-comment/:commentId").delete(verifyJWT, deletComment)

export default router