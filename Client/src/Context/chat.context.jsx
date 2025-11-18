import { createContext, useEffect, useState } from "react";
import { socket } from "../socket.client";
import { useContext } from "react";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [message, setMessage] = useState([]);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            socket.connect();
            socket.emit("register", user._id);
        }

        // Listen for new message
        socket.on("receive_message", (msg) => {
            setMessage(prev => [...prev, msg.message]);
        })

        socket.on("message_updated", (msg) => {
            setMessage((prev) => (
                prev.map((currMsg) => (currMsg._id === msg._id) ? msg : currMsg)
            ))
        })

        socket.on("message_deleted", (msg) => {
            setMessage((prev) => (
                prev.filter((currMsg) => currMsg._id !== msg._id)
            ))
        })

        return () => {
            socket.off("receive_message")
            socket.off("message_updated")
            socket.off("message_deleted")
        }

    }, [])

    return (
        <ChatContext.Provider value={{ message, setMessage }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => useContext(ChatContext)
