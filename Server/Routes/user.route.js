import { Router } from "express";
import { registerUser, loginUser } from "../Controllers/user.controller.js"

const router = Router();
router.route("/login").post(loginUser)
router.route("/register").post(registerUser)

export default router
