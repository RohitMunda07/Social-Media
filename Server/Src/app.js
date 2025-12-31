import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from '../Middleware/error.middleware.js';
import userRouter from '../Routes/user.route.js'
import postRoute from '../Routes/post.router.js'
import subscribeRoute from '../Routes/subscription.router.js'
import videoRouter from "../Routes/video.router.js"
import saveRouter from "../Routes/save.router.js"
import commentRoute from "../Routes/comment.router.js"
import likeRoute from "../Routes/like.router.js"
import messageRouter from "../Routes/message.router.js"

const app = express();

app.use(cors({
    origin: [
        process.env.CORS_ORIGIN,
        "https://social-media-tyho.onrender.com",
        "https://social-media-git-main-dj240800-6382s-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // ⬅️ MUST INCLUDE AUTHORIZATION
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static('Public'))
app.use(cookieParser())

app.get('/api/v1/test', (req, res) => {
    res.send("Testing123")
})

// user route
app.use("/api/v1/users", userRouter)

// post route
app.use("/api/v1/post", postRoute)

// subscription route
app.use("/api/v1/subscription", subscribeRoute)

// video route
app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/test", videoRouter)

// save router
app.use("/api/v1/save", saveRouter)

// comment router
app.use("/api/v1/comment", commentRoute)

// Like router
app.use("/api/v1/like", likeRoute)

// message router
app.use("/api/v1/message", messageRouter)

app.use(errorMiddleware);

export {
    app
}