import dotenv from 'dotenv'
import express from 'express'
import { authRouter } from '../Routes/index.js'
import connectDB from '../DataBase/index.js'

dotenv.config({
    path: './env'
})


connectDB();








// const app = express()

// const PORT = process.env.PORT || 8080


// app.get('/', (req, res) => {
//     res.send('Hello, Server this side')
// })

// app.use('/auth', authRouter)

// app.listen(PORT, () => {
//     console.log(`App is listening on PORT:${PORT}`);

// })