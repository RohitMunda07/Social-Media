import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from '../Routes/user.route.js'
import { errorMiddleware } from '../Middleware/error.middleware.js';

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

app.use("/api/v1/users", userRouter)

app.use(errorMiddleware);

export {
    app
}