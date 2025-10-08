import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import {
    getUsersAllVideo,
    testVideo,
    uploadVideo
} from "../Controllers/video.controller.js";

const router = Router()

router.route("/upload-video").post(verifyJWT, upload.fields([
    {
        name: "video",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), uploadVideo)

router.route("/get-users-all-video").get(verifyJWT, getUsersAllVideo)
router.route("/video-test").get(testVideo)

export default router