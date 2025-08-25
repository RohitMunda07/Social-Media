import { Router } from "express";
import { registerUser, loginUser, searchQuery } from "../Controllers/user.controller.js"

const router = Router();
router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/search").get(searchQuery)

export default router
