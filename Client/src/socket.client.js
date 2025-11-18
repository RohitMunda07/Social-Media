import { io } from "socket.io-client"

const URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(URL, {
    autoConnect: true, // we are doing manual connection
    query: {
        userId: JSON.parse(sessionStorage.getItem("user"))?._id
    }
})