import { createContext, useEffect, useState } from "react";
import { socket } from "../socket.client";
import { useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [message, setMessage] = useState([]);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        // Only connect if user exists and socket not already connected
        if (user && !socket.connected) {
            socket.connect(); // This triggers socket.on("connect") in socket.client.js
        }

        // ✅ Listen for messages from other users
        const handleReceiveMessage = (msg) => {
            console.log("Message received from other user:", msg);
            setMessage(prev => [...prev, msg]); // msg is full object
        };

        // ✅ Listen for confirmation of YOUR sent message
        const handleMessageSent = (msg) => {
            console.log("Your message confirmed:", msg);
            setMessage(prev => [...prev, msg]);
        };

        // Listen for message updates
        const handleMessageUpdated = (msg) => {
            console.log("Message updated:", msg);
            setMessage((prev) =>
                prev.map((currMsg) => (currMsg._id === msg._id) ? msg : currMsg)
            );
        };

        // Listen for message deletions
        const handleMessageDeleted = (msg) => {
            console.log("Message deleted:", msg);
            setMessage((prev) =>
                prev.filter((currMsg) => currMsg._id !== msg._id)
            );
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_sent", handleMessageSent); // ✅ Added this
        socket.on("message_updated", handleMessageUpdated);
        socket.on("message_deleted", handleMessageDeleted);

        // Cleanup
        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_sent", handleMessageSent);
            socket.off("message_updated", handleMessageUpdated);
            socket.off("message_deleted", handleMessageDeleted);
        };

    }, []);

    return (
        <ChatContext.Provider value={{ message, setMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);



// previous code

// import { createContext, useEffect, useState } from "react";
// import { socket } from "../socket.client";
// import { useContext } from "react";
// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//     const [message, setMessage] = useState([]);

//     useEffect(() => {
//         const user = JSON.parse(sessionStorage.getItem("user"));
//         if (user) {
//             socket.connect();
//             // socket.emit("register", user._id);
//         }

//         // Listen for new message
//         socket.on("receive_message", (msg) => {
//             setMessage(prev => [...prev, msg.message]);
//         })

//         socket.on("message_sent", (msg) => {
//             setMessage(prev => [...prev, msg]);
//         })

//         socket.on("message_updated", (msg) => {
//             setMessage((prev) => (
//                 prev.map((currMsg) => (currMsg._id === msg._id) ? msg : currMsg)
//             ))
//         })

//         socket.on("message_deleted", (msg) => {
//             setMessage((prev) => (
//                 prev.filter((currMsg) => currMsg._id !== msg._id)
//             ))
//         })

//         return () => {
//             socket.off("receive_message")
//             socket.off("message_updated")
//             socket.off("message_deleted")
//         }

//     }, [])

//     return (
//         <ChatContext.Provider value={{ message, setMessage }}>
//             {children}
//         </ChatContext.Provider>
//     )
// }

// export const useChat = () => useContext(ChatContext)