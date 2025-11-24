import React, { useEffect, useState } from "react";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { get } from "../APIs/api.js";
import { SearchIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateChatDetails, updateChatId } from "../Context/chat.slice.js"


export default function MessageList({ chats = [], selectedChat, onSelectChat, searchQuery }) {

  const [followers, setFollower] = useState([])
  const [search, setSearch] = useState("")
  const dispatch = useDispatch()

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [searchChat, setSearchChat] = useState([])
  console.log(searchChat);

  const handleSearch = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value);
    let person = followers.filter((chat) => chat.fullName.toLowerCase().includes(e.target.value.toLowerCase()))
    setSearchChat(person)
    console.log(searchChat);
  }

  const getChatId = async (senderId, selectedUser) => {
    console.log("before getting chatId senderId", senderId, "selectedUser", selectedUser);

    try {
      const res = await get("message/find-existing-chatid", {
        params: {
          senderId,
          selectedUser
        }
      })

      console.log("Got the chat id from backend:", res.data.data);
      dispatch(updateChatId(res.data.data))

    } catch (error) {
      console.log("full error", error);
    }
  }

  const handleSelectedChat = (chatId) => {
    const selectedUser = followers.filter((user) => user?._id === chatId)
    console.log("selected user:", selectedUser?.[0] || "empty");
    dispatch(updateChatDetails(selectedUser?.[0]))

    const senderId = JSON.parse(sessionStorage.getItem("user"))?._id
    const selectedUserId = selectedUser?.[0]?._id
    getChatId(senderId, selectedUserId);
  }

  const getAllFollowers = async () => {
    try {
      const res = await get("subscription/getAllSubscriber")
      console.log(res.data.data);
      console.log("TotalSubscribers", res.data.data?.subcriberDetails);
      setFollower(res.data.data?.subcriberDetails)
      console.log("user details after fetching followers", followers);

    } catch (error) {
      console.log("full error:", error);
      console.log(error?.response?.data?.message || "Error fetching User's followers front-end");
    }
  }

  useEffect(() => {
    getAllFollowers();
  }, [])

  return (
    <div className="flex-1 overflow-y-auto h-[90vh] border-1">
      <div className="flex items-center justify-center gap-x-5">
        <input
          type="text"
          placeholder="search"
          className="mt-3 w-[30vw] rounded-2xl outline-0 mb-3 bg-gray-100 px-3 py-2"
          onChange={(e) => handleSearch(e)}
        />
      </div>

      {searchChat.length > 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          {/* <ChatBubbleOutlineIcon className="w-12 h-12 text-gray-400 mb-3 opacity-50" />
          <p className="text-gray-400">No conversations found</p> */}
          {searchChat.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleSelectedChat(chat._id)}
              className={`w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${selectedChat === chat.id ? "bg-blue-100 border-l-4 border-l-blue-500" : ""
                }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full border-b-2 bg-blue-500 text-white flex items-center justify-center font-semibold flex-shrink-0 relative">
                <img src={chat?.avatar} alt="chat avatar" className="absolute inset-0 object-cover w-full h-full rounded-full" />
              </div>

              {/* Chat Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">{chat.fullName}</h3>
                  {/* <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span> */}
                </div>
                {/* <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p> */}
              </div>

              {/* Unread Badge */}
              {/* {chat.unread > 0 && (
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {chat.unread}
              </div>
            )} */}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          {followers.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleSelectedChat(chat._id)}
              className={`w-full px-4 py-4 flex items-center gap-3 bg-white hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${selectedChat === chat.id ? "bg-blue-100 border-l-4 border-l-blue-500" : ""
                }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-semibold flex-shrink-0 relative">
                <img src={chat?.avatar} alt="chat avatar" className="absolute inset-0 object-cover w-full h-full rounded-full" />
              </div>

              {/* Chat Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">{chat.fullName}</h3>
                  {/* <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span> */}
                </div>
                {/* <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p> */}
              </div>

              {/* Unread Badge */}
              {/* {chat.unread > 0 && (
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {chat.unread}
              </div>
            )} */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
