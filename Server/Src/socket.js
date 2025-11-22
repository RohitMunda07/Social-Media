import { Server } from "socket.io";

let onlineUser = new Map();

export const setupSocket = (server) => {
    console.log("\n🔧 setupSocket() called with server:", !!server);

    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["websocket", "polling"]
    });

    console.log("✅ Socket.IO instance created");

    io.on("connection", (socket) => {
        console.log("\n🔗 User connected:", socket.id);

        socket.on("register", (userId) => {
            console.log("📝 Register - User:", userId, "Socket:", socket.id);
            onlineUser.set(userId, socket.id);
            console.log("📊 Online users:", Array.from(onlineUser.keys()));
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected:", socket.id);
            for (let [userId, socketId] of onlineUser) {
                if (socketId === socket.id) {
                    onlineUser.delete(userId);
                    break;
                }
            }
        });
    });

    // ✅ ATTACH IO TO SERVER OBJECT SO IT PERSISTS
    server.io = io;
    console.log("✅ IO attached to server object");

    return io;
};

export const getio = () => {
    // This will try to get it from global or return null
    return global.ioInstance || null;
};

export { onlineUser };


// import { Server } from "socket.io"

// // Track online users:  userId → socketId
// let onlineUser = new Map()
// let ioInstance = null;

// export function setupSocket(server) {
//     const io = new Server(server, {
//         cors: {
//             origin: process.env.CORS_ORIGIN,
//             methods: ["GET", "POST"]
//         }
//     })

//     ioInstance = io

//     io.on("connection", (socket) => {
//         console.log("user connected:", socket.id);

//         // -------------------------------
//         // REGISTER USER
//         // -------------------------------
//         socket.on("register", (userId) => {
//             onlineUser.set(userId, socket.id)
//             // console.log(`${userId} registered with socket: ${socket.id}`)
//             console.log("Registered user:", userId, "->", socket.id);
//         })


//         // -------------------------------
//         // SEND NEW MESSAGE
//         // -------------------------------
//         socket.on("send_message", (data) => {
//             // data = { receiverId, message }
//             const { receiverId, message } = data

//             const receiverSocketId = onlineUser.get(receiverId)

//             if (receiverSocketId) {
//                 io.to(receiverSocketId).emit("receive_message", data)
//                 console.log(`New message sent to: ${receiverId}`)
//             }

//             // notify user
//             io.to(socket.id).emit("message_sent", data)
//         })

//         // -------------------------------
//         // UPDATE MESSAGE
//         // -------------------------------
//         socket.on("update_message", (data) => {
//             // data = { receiverId, updatedMessage }
//             const { receiverId } = data
//             const receiverSocketId = onlineUser.get(receiverId)

//             if (receiverSocketId) {
//                 io.to(receiverSocketId).emit("message_updated", data)
//                 console.log(`Message updated for: ${receiverId}`)
//             }
//         })


//         // -------------------------------
//         // DELETE MESSAGE
//         // -------------------------------
//         socket.on("delete_message", (data) => {
//             // data = { receiverId, messageId }
//             const { receiverId } = data
//             const receiverSocketId = onlineUser.get(receiverId)

//             if (receiverSocketId) {
//                 io.to(receiverSocketId).emit("message_deleted", data)
//                 console.log(`Message deleted for: ${receiverId}`)
//             }
//         })


//         // -------------------------------
//         // DISCONNECT USER
//         // -------------------------------
//         socket.on("disconnect", () => {
//             for (let [userId, id] of onlineUser) {
//                 if (id === socket.id) {
//                     onlineUser.delete(userId)
//                     console.log(`User disconnected: ${userId}`)
//                     break
//                 }
//             }
//         })
//     })
// }

// export function getio() {
//     return ioInstance
// }

// export { onlineUser }