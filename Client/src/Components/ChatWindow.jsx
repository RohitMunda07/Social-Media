
// ============================================
// FRONTEND: ChatWindow.jsx (FIXED)
// ============================================
import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { SearchIcon } from "lucide-react";
import { post } from "../APIs/api.js";
import { useChat } from "../Context/chat.context.jsx";

export default function ChatWindow() {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatUserDetail = useSelector(state => state.chat.selectedUser);
  const [findInChat, setFindInChat] = useState(false);
  const { message: messages, setMessage } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const senderId = JSON.parse(sessionStorage.getItem("user"))?._id;
    const selectedUser = chatUserDetail?._id;

    try {
      console.log("📤 Sending message...");
      const res = await post("message/create-message", {
        senderId,
        selectedUser,
        textMessage: inputMessage,
        imageMessages: [],
        videoMessage: []
      });

      console.log("✅ Message response:", res.data.data);
      setInputMessage("");
      // Message will be added via socket event, not here

    } catch (error) {
      console.error("❌ Error sending message:", error?.response?.data?.message || error);
    }
  };

  return (
    <div className="flex flex-col flex-1 border-1 h-[90vh]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatUserDetail?.avatar && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-5 border-b-2 border-gray-400 py-2 w-full">
              <img
                src={chatUserDetail?.avatar}
                alt="user avatar"
                className="w-12 h-12 rounded-full"
              />
              <h1 className="text-lg">{chatUserDetail?.fullName}</h1>
            </div>
            <SearchIcon style={{ cursor: "pointer" }} />
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg._id}
            className={`flex gap-3 ${msg.senderId._id === JSON.parse(sessionStorage.getItem("user"))?._id
                ? "flex-row-reverse"
                : "flex-row"
              }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0 text-sm">
              {msg.senderId.fullName?.[0]?.toUpperCase()}
            </div>

            <div
              className={`flex flex-col ${msg.senderId._id === JSON.parse(sessionStorage.getItem("user"))?._id
                  ? "items-end"
                  : "items-start"
                }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId._id === JSON.parse(sessionStorage.getItem("user"))?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                  }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.textMessage}
                </p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4 md:p-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
          >
            <SendIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}




// import React, { useState, useRef, useEffect } from "react";
// import SendIcon from "@mui/icons-material/Send";
// import { useSelector } from "react-redux";
// import { SearchCheckIcon, SearchIcon } from "lucide-react";
// import { post } from "../APIs/api.js";
// import { useLocation } from "react-router";
// import { useChat } from "../Context/chat.context.jsx"
// import { socket } from "../socket.client.js";

// export default function ChatWindow() {
//   const [inputMessage, setInputMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const chatUserDetail = useSelector((state) => state.chat.selectedUser)
//   const [findInChat, setFindInChat] = useState(false)
//   const { message: messages, setMessage } = useChat();

//   // const dataFromSession = JSON.parse(sessionStorage.getItem("user"))?._id
//   // console.log("userId from Session Storage:", dataFromSession);

//   // console.log("chat details form messageList", chatUserDetail);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleFindInChat = () => {
//     setFindInChat((prev) => !prev)
//   }

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // const handleSend = async () => {
//   //   if (!inputMessage.trim()) return;

//   //   const senderId = JSON.parse(sessionStorage.getItem("user"))?._id;
//   //   const selectedUser = chatUserDetail?._id;

//   //   try {
//   //     const res = await post("message/create-message", {
//   //       senderId,
//   //       selectedUser,
//   //       textMessage: inputMessage,
//   //     });

//   //     const newMessage = res.data.data;

//   //     setInputMessage("");

//   //     // update UI
//   //     setMessage(prev => [...prev, newMessage]);

//   //     // emit correct data
//   //     socket.emit("send_message", {
//   //       receiverId: selectedUser,
//   //       message: newMessage,
//   //     });

//   //     console.log("Latest message:", newMessage);

//   //   } catch (error) {
//   //     console.log("Error:", error?.response?.data?.message);
//   //   }
//   // };


//   const handleSend = async () => {
//     if (!inputMessage.trim()) return;

//     const senderId = JSON.parse(sessionStorage.getItem("user"))?._id;
//     const selectedUser = chatUserDetail?._id;

//     try {
//       const res = await post("message/create-message", {
//         senderId,
//         selectedUser,
//         textMessage: inputMessage,
//       });

//       const newMessage = res.data.data;
//       setInputMessage("");

//       // ✅ Message will arrive via socket "message_sent" event
//       setMessage(prev => [...prev, newMessage]);
//       // No need to manually update setMessage here

//       console.log("Message sent:", newMessage);

//     } catch (error) {
//       console.error("Error:", error?.response?.data?.message);
//     }
//   };

//   return (
//     <div className="flex flex-col flex-1 border-1 h-[90vh]">
//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {chatUserDetail?.avatar.length > 0 &&
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-x-5 border-b-2 border-gray-400 py-2 w-full">
//               <img src={chatUserDetail?.avatar} alt="user avatar" className="w-12 h-12 rounded-full" />
//               <h1 className="text-lg">{chatUserDetail?.fullName}</h1>
//             </div>

//             <div className="flex items-center gap-x-3 relative">
//               {findInChat && <input type="text" placeholder="search" className="bg-gray-200 outline-0 px-2 py-1 rounded-lg absolute right-10 -top-1" />}
//               <SearchIcon onClick={() => handleFindInChat()} cursor={"pointer"} />
//             </div>
//           </div>
//         }
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex gap-3 ${message.own ? "flex-row-reverse" : "flex-row"}`}
//           >
//             {/* Avatar */}
//             <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0 text-sm">
//               {message.avatar}
//             </div>

//             {/* Message Bubble */}
//             <div className={`flex flex-col ${message.own ? "items-end" : "items-start"}`}>
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.own
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-800"
//                   }`}
//               >
//                 <p className="text-sm whitespace-pre-wrap break-words">{message.textMessage}</p>
//               </div>
//               <span className="text-xs text-gray-500 mt-1">{message.time}</span>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="border-t border-gray-200 bg-white p-4 md:p-6">
//         <div className="flex gap-3">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSend()}
//             className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//           />
//           <button
//             onClick={handleSend}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
//           >
//             <SendIcon className="w-4 h-4" />
//             <span className="hidden sm:inline">Send</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// // const handleSend = async () => {
// //   // Handle message sending logic here
// //   if (inputMessage.trim()) {
// //     const senderId = JSON.parse(sessionStorage.getItem("user"))?._id
// //     const selectedUser = chatUserDetail?._id
// //     console.log("sender id:", senderId);

// //     try {
// //       const res = await post("message/create-message", { senderId, selectedUser, textMessage: inputMessage })
// //       // console.log("Message sent:", inputMessage);
// //       setInputMessage("");
// //       console.log("res afte sending message:", res.data);
// //       const newMessage = res.data.data?.textMessage || ""

// //       // Add to UI instantly
// //       setMessage(prev => [...prev, newMessage])

// //       // Send via socket to receiver
// //       socket.emit("send_message", {
// //         receiverId: selectedUser,
// //         message: newMessage,
// //       });

// //       console.log("Latest message:", newMessage);

// //     } catch (error) {
// //       console.log("full error:", error);
// //       console.log(error?.response?.data?.message || "Error sending message from frontend");
// //     }
// //   }
// // };