// Roll Back to previous code

import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import { SearchIcon } from "lucide-react";
import { get, post } from "../APIs/api.js";
import { useChat } from "../Context/chat.context.jsx";

export default function ChatWindow() {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  // Get selected user from Redux
  const chatUserDetail = useSelector(state => state.chat.selectedUser);
  const chatId = useSelector((state) => state.chat.chatId)

  // Get messages from context (for real-time updates)
  const { message: messages, setMessage } = useChat();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Fetch messages when user is selected
  useEffect(() => {
    if (chatUserDetail?._id) {
      fetchMessages();
    } else {
      // Clear messages if no user selected
      setMessage([]);
    }
  }, [chatUserDetail?._id]); // Only run when selected user changes

  const fetchMessages = async () => {
    const currentUserId = JSON.parse(sessionStorage.getItem("user"))?._id;
    const selectedUserId = chatUserDetail?._id;

    if (!currentUserId || !selectedUserId) {
      console.warn("Missing user IDs");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📥 Fetching messages between:", currentUserId, "and", selectedUserId);

      // Use userId1 and userId2 instead of chatId
      const res = await get("message/get-all-messages", {
        params: {
          chatId,
          // userId1: currentUserId,
          // userId2: selectedUserId,
          // page: 1,
          // limit: 50
        }
      });

      console.log("✅ Messages fetched:", res.data.data);

      const fetchedMessages = res.data.data.allMessages || [];

      // ✅ REPLACE messages, don't add to them
      setMessage(fetchedMessages);

      // Optionally store chatId in Redux for future use
      if (res.data.data.chatId) {
        // dispatch(setChatId(res.data.data.chatId));
        console.log("💾 ChatId:", res.data.data.chatId);
      }

    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      setError(error?.response?.data?.message || "Failed to fetch messages");
      setMessage([]); // Clear messages on error
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const senderId = JSON.parse(sessionStorage.getItem("user"))?._id;
    const selectedUser = chatUserDetail?._id;

    if (!senderId || !selectedUser) {
      console.error("Missing sender or receiver ID");
      return;
    }

    try {
      console.log("📤 Sending message...");

      const res = await post("message/create-message", {
        senderId,
        selectedUser,
        textMessage: inputMessage,
        imageMessages: [],
        videoMessage: []
      });

      console.log("✅ Message sent:", res.data.data);

      // Clear input immediately
      setInputMessage("");

      // Message will be added via socket "message_sent" event
      // No need to manually add it here

    } catch (error) {
      console.error("❌ Error sending message:", error?.response?.data?.message || error);
    }
  };

  // Get current user ID for comparison
  const currentUserId = JSON.parse(sessionStorage.getItem("user"))?._id;

  return (
    <div className="flex flex-col flex-1 border-1 h-[90vh]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* User Header */}
        {chatUserDetail?.avatar && (
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4">
            <div className="flex items-center gap-x-5 border-b-2 border-gray-400 py-2 w-full">
              <img
                src={chatUserDetail.avatar}
                alt="user avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold">{chatUserDetail.fullName}</h1>
                <p className="text-xs text-gray-500">@{chatUserDetail.userName}</p>
              </div>
            </div>
            <SearchIcon className="cursor-pointer hover:text-blue-500" />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* No User Selected */}
        {!chatUserDetail && !loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Select a user to start chatting</p>
          </div>
        )}

        {/* No Messages */}
        {!loading && chatUserDetail && messages.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        )}

        {/* Messages List */}
        {!loading && messages.length > 0 && messages.map(msg => {
          // Check if message has senderId populated
          if (!msg.senderId) {
            console.warn("Message missing senderId:", msg);
            return null;
          }

          const isSentByMe = msg.senderId._id === currentUserId;

          return (
            <div
              key={msg._id}
              className={`flex gap-3 ${isSentByMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0 text-sm overflow-hidden">
                {msg.senderId.avatar ? (
                  <img
                    src={msg.senderId.avatar}
                    alt={msg.senderId.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{msg.senderId.fullName?.[0]?.toUpperCase()}</span>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-xs lg:max-w-md ${isSentByMe ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2 rounded-lg ${isSentByMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.textMessage}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {chatUserDetail && (
        <div className="border-t border-gray-200 bg-white p-4 md:p-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}











// // ============================================
// // FRONTEND: ChatWindow.jsx (FIXED)
// // ============================================
// import React, { useState, useRef, useEffect } from "react";
// import SendIcon from "@mui/icons-material/Send";
// import { useSelector } from "react-redux";
// import { SearchIcon } from "lucide-react";
// import { get, post } from "../APIs/api.js";
// import { useChat } from "../Context/chat.context.jsx";

// export default function ChatWindow() {
//   const [inputMessage, setInputMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const chatUserDetail = useSelector(state => state.chat.selectedUser);
//   const [findInChat, setFindInChat] = useState(false);
//   const { message: messages, setMessage } = useChat();
//   const chatId = useSelector((state) => state.chat.chatId)
//   const [allMessages, setAllMessages] = useState();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };



//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!inputMessage.trim()) return;

//     const senderId = JSON.parse(sessionStorage.getItem("user"))?._id;
//     const selectedUser = chatUserDetail?._id;
//     console.log("selected userId: in chatwindow", selectedUser);

//     try {
//       console.log("📤 Sending message...");
//       const res = await post("message/create-message", {
//         senderId,
//         selectedUser,
//         textMessage: inputMessage,
//         imageMessages: [],
//         videoMessage: []
//       });

//       console.log("✅ Message response:", res.data.data);
//       setInputMessage("");
//       // Message will be added via socket event, not here

//     } catch (error) {
//       console.error("❌ Error sending message:", error?.response?.data?.message || error);
//     }
//   };

//   const getAllMessages = async () => {
//     console.log("before fetching all messages chatId:", chatId);

//     try {
//       const res = await get("message/get-all-messages", {
//         params: {
//           chatId
//         }
//       })
//       console.log("got all chat messages from backend", res.data.data);
//       setAllMessages(res.data.data)
//       console.log(allMessages);

//     } catch (error) {
//       console.log("Full Error", error);
//     }
//   }

//   // getAllMessages()

//   useEffect(() => {
//     getAllMessages()
//   }, [])

//   return (
//     <div className="flex flex-col flex-1 border-1 h-[90vh]">
//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {chatUserDetail?.avatar && (
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-x-5 border-b-2 border-gray-400 py-2 w-full">
//               <img
//                 src={chatUserDetail?.avatar}
//                 alt="user avatar"
//                 className="w-12 h-12 rounded-full"
//               />
//               <h1 className="text-lg">{chatUserDetail?.fullName}</h1>
//             </div>
//             <SearchIcon style={{ cursor: "pointer" }} />
//           </div>
//         )}

//         {messages.map(msg => (
//           <div
//             key={msg._id}
//             className={`flex gap-3 ${msg.senderId._id === JSON.parse(sessionStorage.getItem("user"))?._id
//               ? "flex-row-reverse"
//               : "flex-row"
//               }`}
//           >
//             <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0 text-sm">
//               {msg.senderId.fullName?.[0]?.toUpperCase()}
//             </div>

//             <div
//               className={`flex flex-col ${msg.senderId._id === JSON.parse(sessionStorage.getItem("user"))?._id
//                 ? "items-end"
//                 : "items-start"
//                 }`}
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId._id === JSON.parse(sessionStorage.getItem("user"))?._id
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 text-gray-800"
//                   }`}
//               >
//                 <p className="text-sm whitespace-pre-wrap break-words">
//                   {msg.textMessage}
//                 </p>
//               </div>
//               <span className="text-xs text-gray-500 mt-1">
//                 {new Date(msg.createdAt).toLocaleTimeString()}
//               </span>
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
//             onChange={e => setInputMessage(e.target.value)}
//             onKeyPress={e => e.key === "Enter" && handleSend()}
//             className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
