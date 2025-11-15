import dotenv from 'dotenv'
import connectDB from '../DataBase/index.js'
import { app } from './app.js'
import { setupSocket } from './socket.js'
import http from "http"

dotenv.config({
    path: './env'
})


connectDB()
    .then(() => {
        const server = http.createServer(app); // <-- necessary for socket.io
        setupSocket(server)

        server.on("error", (err) => {
            console.log("Error before listening: ", err);
            throw err;
        })

        server.listen(process.env.PORT, () => {
            console.log(`server is listening on PORT: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Error connecting mongoDb: ", err);
    })








// import express from 'express'
// import { authRouter } from '../Routes/index.js'

// const app = express()

// const PORT = process.env.PORT || 8080


// app.get('/', (req, res) => {
//     res.send('Hello, Server this side')
// })

// app.use('/auth', authRouter)

// app.listen(PORT, () => {
//     console.log(`App is listening on PORT:${PORT}`);

// })