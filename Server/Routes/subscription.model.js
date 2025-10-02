import { Router } from "express"
import { verifyJWT } from "../Middleware/auth.middleware.js"
import {
    getAllSubscriber,
    getUserfollowings,
    toggleSubscription
} from "../Controllers/subscription.controller.js"

const router = Router()

router.route("/subscribe/:channelId").get(verifyJWT, toggleSubscription)
router.route("/getAllSubscriber").get(verifyJWT, getAllSubscriber)
router.route("/getUserfollowings").get(verifyJWT, getUserfollowings)

export default router