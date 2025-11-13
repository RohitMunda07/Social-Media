import React from 'react'
import ChatWindow from "../Components/ChatWindow.jsx"
import MessageList from "../Components/MessageList.jsx"

export default function ChatLayout() {
    return (
        <div className='flex items-center justify-center'>
            <MessageList />
            <ChatWindow />
        </div>
    )
}
