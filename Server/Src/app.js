import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from '../Middleware/error.middleware.js';
import userRouter from '../Routes/user.route.js'
import postRoute from '../Routes/post.router.js'
import subscribeRoute from '../Routes/subscription.router.js'
import videoRouter from "../Routes/video.router.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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

app.use(errorMiddleware);

export {
    app
}