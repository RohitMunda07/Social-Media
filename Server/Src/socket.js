// ============================================
// BACKEND: socket.js (COMPLETE & CORRECT)
// ============================================
import { Server } from "socket.io";

// ✅ CRITICAL: Initialize global.onlineUser if it doesn't exist
if (!global.onlineUser) {
    global.onlineUser = new Map();
    console.log("✅ Created global.onlineUser Map");
}

export const setupSocket = (server) => {
    console.log("\n🔧 setupSocket() called");

    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["*"]
        },
        transports: ["websocket", "polling"],
        pingInterval: 10000,
        pingTimeout: 5000
    });

    console.log("✅ Socket.IO instance created");

    io.on("connection", (socket) => {
        console.log("\n🔗 NEW CONNECTION");
        console.log("   Socket ID:", socket.id);
        console.log("   Transport:", socket.conn.transport.name);

        // REGISTER USER - Use global.onlineUser
        socket.on("register", (userId) => {
            console.log("\n📝 REGISTER EVENT");
            console.log("   User ID:", userId);
            console.log("   Socket ID:", socket.id);

            if (userId && userId.trim()) {
                global.onlineUser.set(userId, socket.id);
                console.log("✅ User registered in global.onlineUser");
                console.log("📊 Total online users:", global.onlineUser.size);
                console.log("📊 All users:", Array.from(global.onlineUser.keys()));
            } else {
                console.warn("⚠️  Invalid userId:", userId);
            }
        });

        socket.on("disconnect", () => {
            console.log("\n❌ DISCONNECT - Socket ID:", socket.id);

            for (let [userId, socketId] of global.onlineUser) {
                if (socketId === socket.id) {
                    global.onlineUser.delete(userId);
                    console.log("✅ User removed:", userId);
                    break;
                }
            }
            console.log("📊 Remaining users:", global.onlineUser.size);
        });

        socket.on("error", (error) => {
            console.error("❌ Socket error:", error);
        });
    });

    server.io = io;
    console.log("✅ IO attached to server object\n");

    return io;
};

// Export getter function (optional - we use global directly)
export const getOnlineUsers = () => {
    return global.onlineUser;
};
