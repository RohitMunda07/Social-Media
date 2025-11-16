import { Server } from "socket.io"

// Track online users:  userId → socketId
let onlineUser = new Map()
let ioInstance = null;

export function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"]
        }
    })

    ioInstance = io

    io.on("connection", (socket) => {
        console.log("user connected:", socket.id);

        // -------------------------------
        // REGISTER USER
        // -------------------------------
        socket.on("register", (userId) => {
            onlineUser.set(userId, socket.id)
            console.log(`${userId} registered with socket: ${socket.id}`)
        })


        // -------------------------------
        // SEND NEW MESSAGE
        // -------------------------------
        socket.on("send_message", (data) => {
            // data = { receiverId, message }
            const { receiverId, message } = data

            const receiverSocketId = onlineUser.get(receiverId)

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", data)
                console.log(`New message sent to: ${receiverId}`)
            }

            // notify user
            io.to(socket.id).emit("message_sent", data)
        })

        // -------------------------------
        // UPDATE MESSAGE
        // -------------------------------
        socket.on("update_message", (data) => {
            // data = { receiverId, updatedMessage }
            const { receiverId } = data
            const receiverSocketId = onlineUser.get(receiverId)

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("message_updated", data)
                console.log(`Message updated for: ${receiverId}`)
            }
        })


        // -------------------------------
        // DELETE MESSAGE
        // -------------------------------
        socket.on("delete_message", (data) => {
            // data = { receiverId, messageId }
            const { receiverId } = data
            const receiverSocketId = onlineUser.get(receiverId)

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("message_deleted", data)
                console.log(`Message deleted for: ${receiverId}`)
            }
        })


        // -------------------------------
        // DISCONNECT USER
        // -------------------------------
        socket.on("disconnect", () => {
            for (let [userId, id] of onlineUser) {
                if (id === socket.id) {
                    onlineUser.delete(userId)
                    console.log(`User disconnected: ${userId}`)
                    break
                }
            }
        })
    })
}

export function getio() {
    return ioInstance
}

export { onlineUser }