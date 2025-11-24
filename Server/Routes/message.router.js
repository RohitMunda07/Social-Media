import Router from "express"
import { verifyJWT } from "../Middleware/auth.middleware.js"
import {
    createMessage,
    getAllMessages,
    updateMessage,
    deleteMessage,
    findOrCreateChatId
} from "../Controllers/message.controller.js"

const router = Router()

router.route("/find-existing-chatid").get(verifyJWT, findOrCreateChatId)
router.route("/create-message").post(verifyJWT, createMessage)
router.route("/get-all-messages").get(verifyJWT, getAllMessages)
router.route("/update-message").put(verifyJWT, updateMessage)
router.route("/delete-message").delete(verifyJWT, deleteMessage)

export default router