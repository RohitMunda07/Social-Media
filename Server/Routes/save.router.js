import { Router } from "express"
import { getAllSavedPost, toggleUserSavePost } from "../Controllers/save.controller.js"
import { verifyJWT } from "../Middleware/auth.middleware.js"

const router = Router()

router.route("/save-post/:postId").post(verifyJWT, toggleUserSavePost)
router.route("/get-all-saved-post").get(verifyJWT, getAllSavedPost)

export default router