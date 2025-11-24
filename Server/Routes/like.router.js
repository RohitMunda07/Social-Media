import { Router } from "express";
import { getAllLikes, toggleLike } from "../Controllers/like.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/toggle-like/:postId").post(verifyJWT, toggleLike)
router.route("/get-all-likes").get(verifyJWT, getAllLikes)

export default router