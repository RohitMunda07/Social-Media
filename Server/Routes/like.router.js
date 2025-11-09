import { Router } from "express";
import { toggleLike } from "../Controllers/like.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/toggle-like").put(verifyJWT, toggleLike)

export default router