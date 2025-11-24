import { createContext, useEffect, useState, useContext } from "react";
import { socket } from "../socket.client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [message, setMessage] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (user) {
            console.log("🔌 ChatProvider - Connecting socket for user:", user._id);
            
            if (!socket.connected) {
                socket.connect();
                console.log("✅ Socket connect() called");
            } else {
                console.log("⚠️  Socket already connected");
            }

            setIsConnected(true);
        } else {
            console.warn("⚠️  No user in sessionStorage");
        }

        // Listen for incoming messages
        const handleReceiveMessage = (msg) => {
            console.log("📨 Received message:", msg);
            setMessage(prev => {
                if (prev.some(m => m._id === msg._id)) {
                    return prev;
                }
                return [...prev, msg];
            });
        };

        // Listen for sent message confirmation
        const handleMessageSent = (msg) => {
            console.log("✅ Message sent confirmation:", msg);
            setMessage(prev => {
                if (prev.some(m => m._id === msg._id)) {
                    return prev;
                }
                return [...prev, msg];
            });
        };

        // Listen for message updates
        const handleMessageUpdated = (msg) => {
            console.log("✏️ Message updated:", msg);
            setMessage(prev =>
                prev.map(m => m._id === msg._id ? msg : m)
            );
        };

        // Listen for message deletions
        const handleMessageDeleted = (msg) => {
            console.log("🗑️ Message deleted:", msg);
            setMessage(prev =>
                prev.filter(m => m._id !== msg._id)
            );
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_sent", handleMessageSent);
        socket.on("message_updated", handleMessageUpdated);
        socket.on("message_deleted", handleMessageDeleted);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_sent", handleMessageSent);
            socket.off("message_updated", handleMessageUpdated);
            socket.off("message_deleted", handleMessageDeleted);
        };
    }, []);

    return (
        <ChatContext.Provider value={{ message, setMessage, isConnected }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return context;
};


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