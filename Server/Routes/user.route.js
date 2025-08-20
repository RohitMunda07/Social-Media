import { Router } from "express";
import { registerUser, loginUser, searchDataOnDb } from "../Controllers/user.controller.js"

const router = Router();
router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/search").post(searchDataOnDb)

export default router
