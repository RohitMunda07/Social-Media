// ============================================
// FRONTEND: socket.client.js (FIXED)
// ============================================
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

console.log("🔌 Socket.IO connecting to:", URL);

export const socket = io(URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    transports: ["websocket", "polling"], // ✅ Allow both
    withCredentials: true,
    query: {
        userId: JSON.parse(sessionStorage.getItem("user"))?._id
    }
});

socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    const userId = JSON.parse(sessionStorage.getItem("user"))?._id;
    if (userId) {
        socket.emit("register", userId);
        console.log("📝 Sent register event with userId:", userId);
    }
});

socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
    console.error("❌ Connection error:", error.message);
    console.error("   Full error:", error);
});

socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
});



// import { io } from "socket.io-client"

// const URL = import.meta.env.VITE_BACKEND_URL;

// export const socket = io(URL, {
//     autoConnect: false, // we are doing manual connection
//     query: {
//         userId: JSON.parse(sessionStorage.getItem("user"))?._id
//     }
// })

// socket.on("connect", () => {
//     const userId = JSON.parse(sessionStorage.getItem("user"))?._id
//     if (userId) {
//         socket.emit("register", userId)
//         console.log("User registered:", userId)
//     }
// })