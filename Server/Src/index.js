import dotenv from 'dotenv'
import express from 'express'
import { authRouter } from '../Routes/index.js'
import connectDB from '../DataBase/index.js'
import { app } from './app.js'

dotenv.config({
    path: './env'
})


connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Error before listening: ", err);
            throw err;
        })
        
        app.listen(process.env.PORT, () => {
            console.log(`server is listening on PORT: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Error connecting mongoDb: ", err);
    })








// const app = express()

// const PORT = process.env.PORT || 8080


// app.get('/', (req, res) => {
//     res.send('Hello, Server this side')
// })

// app.use('/auth', authRouter)

// app.listen(PORT, () => {
//     console.log(`App is listening on PORT:${PORT}`);

// })